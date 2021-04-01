const ZKLib = require("node-zklib");

async function test (){
    let zkInstance = new ZKLib('192.168.0.201', 4370, 10000, 5000);
    try {     
        await zkInstance.createSocket()
 
    } catch (e) {
        console.log(e)
        if (e.code === 'EADDRINUSE') {
        }
    }
    const logs = await zkInstance.getAttendances()
 return logs;
}

module.exports = {test};
 