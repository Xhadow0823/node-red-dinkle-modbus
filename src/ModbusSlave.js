module.exports = function (RED) {
    function ModbusSlave(config) {
      RED.nodes.createNode(this, config);
      this.name = config.name;
      this.id = config.id;
      
      this.ModbusRTU = require("modbus-serial");
      
      let node = this;
    }
    RED.nodes.registerType("ModbusSlave", ModbusSlave);
  }