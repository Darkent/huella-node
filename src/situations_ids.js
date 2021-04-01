const querys = require("./db_querys");

async function get_situations_ids(personal_ids){
    let situations_ids = [];
    for(var i=0 ; i<personal_ids.length ; i ++){
        
        let  personal_id = Object.values(personal_ids[i])[0];
        let situations_id = await querys.get_situation_id(personal_id);
        situations_ids.push({[personal_id] :situations_id});
    }
    return situations_ids;
}

function add_situation_id(registers,situations_ids){
    var situations_id_join = {};
    situations_ids.forEach((p)=>{
        Object.keys(p).forEach((k)=>{
            situations_id_join[k] = p[k]
        });
    })
    
    var personal_ids = situations_ids.map((situation_id)=>Object.keys(situation_id)[0]);
  
    for(var i = 0 ; i < personal_ids.length ; i ++){
        let personal_id = personal_ids[i];
        
        for(var j = 0 ; j<registers.length ;j++){
            let register = registers[j];
        
            if(register.personal_id == personal_id){
                
                register.situation_id = situations_id_join[personal_id]
            }
        }
    }
}

module.exports = {get_situations_ids,add_situation_id}