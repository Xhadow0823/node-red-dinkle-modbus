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
  
        //////////////////// TEST CODE ABOVE ////////////////////
        // check config needed in modbus packet
        // check if config.funcCode exist
        // if not exist
        //   check if msg.payload.xx exist
        //   if not then
        //     show error and return
        //   else
        //     use xx from msg payload in
        // else
        //   use xx from config.xx
        // check if config.address exist
        // if not exist
        //   check if msg.payload.xx exist
        //   if not then
        //     show error and return
        //   else
        //     use xx from msg payload in
        // else
        //   use xx from config.xx
        // check if config.byteCount exist
        // if not exist
        //   check if msg.payload.xx exist
        //   if not then
        //     show error and return
        //   else
        //     use xx from msg payload in
        // else
        //   use xx from config.xx
        // check if config.data exist
        // if not exist
        //   check if msg.payload.xx exist
        //   if not then
        //     show error and return
        //   else
        //     use xx from msg payload in
        // else
        //   use xx from config.xx
  
  
        // check if the connection is open 
        // if error
        //   log error
        //   return
        // if not open
        //   open()
        
        // check input msg.payload
        // if msg.payload not valid
        //   log error
        //   return 
        // else
        //   send command to modbus slave  and  get the response
  
        // check if the response status
        // if response status error
        //   log error
        //   return
        // else
        //   send the response to next
        //   send(msg);
        
  
  
        // send(msg);
      });
    }
    RED.nodes.registerType("DI", DIModule);
  }