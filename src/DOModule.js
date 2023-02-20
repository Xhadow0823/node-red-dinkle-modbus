module.exports = function (RED) {
  function DOModule(config) {
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
      // // show node name
      // console.log(`==========${ node.name }==========`)
      // if(node.server) {
      //   // this.log(`config: ${JSON.stringify(node.server)}`);
      //   // console.log(node.server);
      // }else {
      //   this.error("No config found!");
      //   return ;
      // }

      // if(!node.server.isOpened()) {
      //   await node.server.open();
      // }
      // node.server.blink();

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
      
      // send(msg);
      

      //////////////////// GO ////////////////////
      if(!node.server) {
        console.log("- DOModule: Modbus server not provided in config");
        return;
      }
      let packet = Object.assign({}, {
        slaveID:   msg.payload.slaveID || node.slaveID,
        funcCode:  msg.payload.funcCode || node.funcCode,
        address:   msg.payload.address || node.address,
        byteCount: msg.payload.byteCount || node.byteCount,
        data:      msg.payload.data || node.data
      });
      // TODO:
      // ONLY check slaveID here and the rest will be check in modbusServer.do!!
      // if(!(packet.slaveID && packet.funcCode && packet.address && packet.byteCount && packet.data)) {
      //   console.log(`- DOModule: modbus packet error: ${
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
        console.log("+ DOModule: Modbus response: ", response);
        msg.payload = Object.assign({}, response);
        send(msg);
      }).catch((error) => {
        console.log("- DOModule: Modbus request error: ", error);
        return ;
      });

    });
  }
  RED.nodes.registerType("DO", DOModule);
}