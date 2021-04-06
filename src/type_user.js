const querys = require("./db_querys");


async function get_types_users(deviceUserIds){
    let types_users = [];
    for(var i=0 ; i<deviceUserIds.length ; i ++){
        let  deviceUserId = deviceUserIds[i];
        let type_user = await querys.get_type_user(deviceUserId);
        types_users.push({[deviceUserId] : type_user});
    }
    return types_users;
}

function add_type_user(registers,type_user){
    var typer_user_join = {};
    type_user.forEach((p)=>{
        Object.keys(p).forEach((k)=>{
            typer_user_join[k] = p[k]
        });
    })
    
    var deviceUserIds = type_user.map((type_user)=>Object.keys(type_user)[0]);
  
    for(var i = 0 ; i < deviceUserIds.length ; i ++){
        let deviceUserId = deviceUserIds[i];
        
        for(var j = 0 ; j<registers.length ;j++){
            let register = registers[j];
        
            if(register.deviceUserId == deviceUserId){
                
                register.type_user = typer_user_join[deviceUserId]
            }
        }
    }
}
module.exports = {get_types_users,add_type_user}