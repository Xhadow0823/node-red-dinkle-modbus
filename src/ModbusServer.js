// TODO: make serial pool for Modbus communication
module.exports = function (RED) {
    function ModbusServer(config) {
      RED.nodes.createNode(this, config);

      this.name = config.name;

      this.serialport = config.serialport;
      this.serialbaud = parseInt(config.serialbaud) || 115200;
      this.databits   = parseInt(config.databits) || 8;
      this.parity     = config.parity || "none";
      this.stopbits   = parseInt(config.stopbits) || 1;

      this.responsetimeout = config.responsetimeout || 10000;

      let node = this; // use node to get this in function declaration
      // private property
      const { default: ModbusRTU } = require("modbus-serial");
      this.server = new ModbusRTU();
      // private method
      // open Modbus serial connection
      this.openSerial = function() {
        return node.server.connectRTUBuffered(
          node.serialport, 
          {
            baudRate: node.serialbaud,
            dataBits: node.databits,
            stopBits: node.stopbits,
            parity:   node.parity
          }
        ).then(() => {
          console.log("+ Modbus Server: connection created");
        }).catch(reason => {
          console.log("- Modbus Server: connection error: ", reason);
        });
      }

      // public property
      // public method
      this.isOpened = function() {
        return node.server.isOpen;
      };

      this.open = async function() {
        try {
          await node.server.connectRTUBuffered(
            node.serialport, 
            {
              baudRate: node.serialbaud,
              dataBits: node.databits,
              stopBits: node.stopbits,
              parity:   node.parity
            }
          );
          console.log("Modbus serial connect successfully!")
        }catch(e) {
          console.log("ModbusRTU connect error: ", e);
        }
      };

      node.remainBlink = 10;
      this.blink = function() {
        if(!this.isOpened()) {
          this.error("ERROR: connection not found");
          return;
        }
        function bbb() {
          node.server.setID(0x02);
          node.server.writeRegister(0x2000, node.remainBlink%2? 0b0101010101010101 : 0b1010101010101010).then(() => {
            if(node.remainBlink > 0) {
              node.remainBlink = node.remainBlink - 1;
              setTimeout(bbb, 1000);
            }
          })
        }
        node.remainBlink = 10;
        bbb();
      }
      
      node.setID = function(id) {
        node.server.setID(id);
      };
      node.setTimeout = function(timeout) {
        node.server.setTimeout(timeout);
      };
      /**
       * 
       * @param funcCode string
       * @param packet object, { unitID, funcCode, address, byteCount, data }
       * @returns Promise
       */
      this.do = function(funcCode, packet) {
        async function doFunc(packet) {
          console.log(">>>DEBUG<<<: ", packet);
          switch(packet.funcCode) {
            case 0x01: 
              // ReadCoilResult {
              //   data: Array<boolean>;
              //   buffer: Buffer;
              // }
              // TODO: 
              // check address and byteCount here!!
              return await node.server.readCoils(packet.address, packet.byteCount);
            case 0x05:
              return await node.server.writeCoil(packet.address, !!packet.data);
            case 0x06: 
              // WriteRegisterResult {
              //   address: number;
              //   value: number;
              // }
              return await node.server.writeRegister(packet.address, packet.data);
            // ==================== for DIModule ====================
            case 0x02:
              return await node.server.readDiscreteInputs(packet.address, packet.byteCount);
            case 0x03:
              return await node.server.readHoldingRegisters(packet.address, packet.byteCount);
            case 0x04:
              return await node.server.readInputRegisters(packet.address, packet.byteCount);
            // ==================== NOT IMPLEMENT ====================
            case 0x0F:  // use FC15 or writeCoils???
              // writeFC15(address: number, dataAddress: number, states: Array<boolean>, next: NodeStyleCallback<WriteMultipleResult>): void;
              // return await node.server.writeCoils(packer.address, [ packer.data ]);  // array ?!!!
            case 0x10:  // FC16 or writeRegisters???
              // writeFC16(address: number, dataAddress: number, values: Array<number>, next: NodeStyleCallback<WriteMultipleResult>): void;
              // return await node.server.writeRegisters(packet.address, [ packet.data ]);  // array ?!!!
            default: 
              console.log("- Modbus Server: unknown function code: ", packet.funcCode);
              return ;
          }
        }
        return new Promise((resolve, reject) => {
          try {
            node.setID(packet.slaveID);
            if(!node.isOpened()) {
              node.openSerial().then(() => {
                resolve(doFunc(packet));
              }).catch(reject);
            }else {
              resolve(doFunc(packet));
            }
          }catch(err) {
            console.log("- Modbus server: error occurred when do:", packet, err);
            reject(err);
          }
        });
      };

      node.on("close", function(done) {
        console.log("+ Modbus server: closing the serial...");
        node.server.close(done);
      });
    }
    RED.nodes.registerType("ModbusServer", ModbusServer);
  }