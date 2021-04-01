const querys = require("./db_querys");

async function get_users_ids(deviceUserIds){
    let users_ids = [];
    for(var i=0 ; i<deviceUserIds.length ; i ++){
        let  deviceUserId = deviceUserIds[i];
        let user_id = await querys.get_user_id(deviceUserId);
        users_ids.push({[deviceUserId] : user_id});
    }
    return users_ids;
}

function add_personal_id(registers,personal_ids){
    var personal_id_join = {};
    personal_ids.forEach((p)=>{
        Object.keys(p).forEach((k)=>{
            personal_id_join[k] = p[k]
        });
    })
    
    var deviceUserIds = personal_ids.map((personal_id)=>Object.keys(personal_id)[0]);
  
    for(var i = 0 ; i < deviceUserIds.length ; i ++){
        let deviceUserId = deviceUserIds[i];
        
        for(var j = 0 ; j<registers.length ;j++){
            let register = registers[j];
        
            if(register.deviceUserId == deviceUserId){
                
                register.personal_id = personal_id_join[deviceUserId]
            }
        }
    }
}
module.exports = {get_users_ids,add_personal_id}