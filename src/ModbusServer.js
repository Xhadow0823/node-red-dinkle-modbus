module.exports = function (RED) {
    function ModbusServer(config) {
      RED.nodes.createNode(this, config);
      this.name = config.name;
      this.port = config.port;
      
      
      let node = this;
    }
    RED.nodes.registerType("ModbusServer", ModbusServer);
  }