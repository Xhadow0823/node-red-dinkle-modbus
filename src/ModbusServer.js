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

    }
    RED.nodes.registerType("ModbusServer", ModbusServer);
  }