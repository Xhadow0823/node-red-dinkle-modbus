module.exports = function (RED) {
  function DIModule(config) {
    RED.nodes.createNode(this, config);
    // ===== prepare property with config object =====
    this.name      = config.name;
    this.server    = RED.nodes.getNode(config.server);  // <- the name is toooooo comfusing
    this.slaveID   = config.slaveID || "";
    this.funcCode  = config.funcCode || "";
    this.address   = config.address || "";
    this.byteCount = config.byteCount || "";
    this.data      = config.data || "";
    // ===== prepare property with config object end =====
    // ===== prepare tools =====
    let node = this;
    // ===== prepare tools end =====
    /**
     * on msg arriving
     */
    node.on("input", async (msg, send, done) => {
      // check if the modbus server is provided
      if(!node.server) {
        console.log("- DIModule: Modbus server not provided in config");
        return;
      }
      // prepare packet for modbus function call
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
      // send packet with server.do() and wait the response
      node.server.do(packet.funcCode, packet).then((response) => {
        console.log("+ DIModule: Modbus response: ", response);
        // send response as node output
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