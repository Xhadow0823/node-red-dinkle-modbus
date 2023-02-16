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
    }
    RED.nodes.registerType("ModbusServer", ModbusServer);
  }