const querys = require("./db_querys");
const utils = require('./utils');
async function insert_or_update(registers){
    for (var i = 0 ; i < registers.length ; i ++){
        let register = registers[i];
        //VERIFICAR SI EXISTE YA EL REGISTRO CON LA FECHA Y EL ID
        let is_exist = await exists(register);
        //SI EXISTE - ACTUALIZAR AGREGANDO AL CAMPO 
        if(is_exist.length > 0){
            update(register,is_exist)
        //SINO EXISTE INSERTAR
        }else{
            insert(register)
        }
    }
}

async function insert(register){
    let keys = Object.keys(register).join(',');
    let values = []
     Object.values(register).forEach((value)=>{
            if(typeof value == "object"){
                values.push("'".concat(JSON.stringify(value),"'"))
            }else{
                values.push(JSON.stringify(value))
            }
     });
     querys.insert(keys,values)
}

async function update(register,row){
    let id = row[0].id;
    let property = utils.property_is(register);
    let filled = await querys.property_filled(property,id);
    let key = Object.keys(register[property])[0];
    key = JSON.stringify(key);
    let value = Object.values(register[property])[0];
    value = JSON.stringify(value);
    if(filled){
        querys.update_fill_field(property,value,key,id,register.uid);
    }else{
        querys.update_empty_field(property,value,key,id,register.uid);
    }
}



async function exists(register){
    let is_exist = await querys.register_exists(register.personal_id,register.date);
    return is_exist;
}


module.exports = {insert_or_update}