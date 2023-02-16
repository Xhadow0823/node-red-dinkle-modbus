module.exports = function (RED) {
  function DOModule(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.slaveID = config.slaveID || "";
    let node = this;


    node.on("input", async (msg, send, done) => {
      if(node.server) {
        this.log(`config: ${JSON.stringify(node.server)}`);
        console.log(node.server);
      }else {
        this.error("No config found!");
      }
      
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
      


      send(msg);
    });
  }
  RED.nodes.registerType("DO", DOModule);
}