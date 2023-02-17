// https://github.com/yaacov/node-modbus-serial#readme

let ModbusRTU = require("modbus-serial");
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let client = new ModbusRTU();

async function connect() {
    try {
        await client.connectRTUBuffered("COM13", {
            baudRate: 115200
        });
    }catch(e) {
        console.log("ERROR: ", e);
    }
    
    client.setTimeout(1000);
    client.open();
}

async function writeDO() {
    client.setID(0x02);

    // client.writeRegister(0x2000, 0xFF00).then(console.log);

    for(let i = 0; i < 10; i++) {
        let result = await client.writeRegister(0x2000, i%2? 0b0101010101010101 : 0b1010101010101010);
        console.log(result);
        await sleep(1000);
    }

    console.log("UWU");
}

function readDI() {

}


console.log("[START]");

let run = async () => {
    await connect();
    await writeDO();
    // client.connectRTUBuffered("COM13", {
    //     baudRate: 115200
    // }, writeDO);
    // console.log("UWU 2");
};

run();

process.on("SIGINT", () => {
    client.close();
    console.log("[END I]");
    process.exit();
});
process.on("exit", () => {
    client.close();
    console.log("[END E]");
});