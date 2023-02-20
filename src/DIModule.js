module.exports = function (RED) {
    function DIModule(config) {
      RED.nodes.createNode(this, config);
      this.name = config.name;
      this.server = RED.nodes.getNode(config.server);  // <- the name is toooooo comfusing
  
      this.slaveID   = config.slaveID || "";

      this.funcCode  = config.funcCode || "";
      this.address   = config.address || "";
      this.byteCount = config.byteCount || "";
      this.data      = config.data || "";
  
      let node = this;
  
      node.on("input", async (msg, send, done) => {
        if(!node.server) {
          console.log("- DIModule: Modbus server not provided in config");
          return;
        }
        let packet = Object.assign({}, {
          slaveID:   msg.payload.slaveID   || node.slaveID,
          funcCode:  msg.payload.funcCode  || node.funcCode,
          address:   msg.payload.address   || node.address,
          byteCount: msg.payload.byteCount || node.byteCount,
          data:      msg.payload.data      || node.data
        });
        // TODO:
        // ONLY check slaveID here and the rest will be check in modbusServer.do!!
        // if(!(packet.slaveID && packet.funcCode && packet.address && packet.byteCount && packet.data)) {
        //   console.log(`- DIModule: modbus packet error: ${
        //     Object.entries(packet).filter(([key, val]) => !val).map(([key,val]) => key).join(", ")
        //   } is/are necessary to provided`);
        //   return;
        // }
        Object.assign(packet, {
          slaveID:   parseInt(packet.slaveID),
          funcCode:  parseInt(packet.funcCode),
          address:   parseInt(packet.address),
          byteCount: parseInt(packet.byteCount),
          data:      parseInt(packet.data)
        });
  
        node.server.do(packet.funcCode, packet).then((response) => {
          console.log("+ DIModule: Modbus response: ", response);
          msg.payload = Object.assign({}, response);
          send(msg);
        }).catch((error) => {
          console.log("- DIModule: Modbus request error: ", error);
          return ;
        });
  
      });
    }
    RED.nodes.registerType("DI", DIModule);
  }