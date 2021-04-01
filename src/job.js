const querys = require("./db_querys");
const {list_assists} = require("./repository");
const utils = require("./utils");
const type_register = require("./type_register");
const users_id = require('./users_ids');
const situations_id = require('./situations_ids');
const overtime = require('./overtime');
const operations = require('./insert_update');
const job = async ()=>{
    //OBTENIENDO EL ULTIMO REGISTRO
    var last_register = await querys.last_assist();
    //OBTENIENDO LA LISTA DE REGISTROS Y FILTRANDO POR EL ULTIMO REGISTRO
    var registers = list_assists.filter((register)=>register.userSn > last_register);
    //VERIFICAR SI HAY REGISTROS
    if(registers.length === 0){
        console.log("Sin nuevos registros");
        return;
    }
    //QUITANDO 5 HORAS POR LA ZONA
    registers = utils.change_time(registers);
    //OBTENIENDO LOS LIMITES
    var times = await querys.get_schedule();
    //TIPO DE REGISTRO
    type_register(registers,times);
    //SET DE DEVICEUSERID
    let deviceUserIds = Array.from(new Set(registers.map((register)=>register.deviceUserId)));
    //TRAER DE LA DB LOS USERS ID SEGUN EL DEVICEUSERID 
    let personal_ids = await users_id.get_users_ids(deviceUserIds);
    //TRAER DE LA DB LOS SITUATION_ID SEGUN LOS PERSONAL_IDS
    let situtation_ids = await situations_id.get_situations_ids(personal_ids);
    //AGREGAR PERSONAL ID
    users_id.add_personal_id(registers,personal_ids);
    //AGREAR SITUATION ID
    situations_id.add_situation_id(registers,situtation_ids)
    //AGREGAR LOS DEMAS CAMPOS 
    utils.add_fields(registers)
    //CHECAR TARDANZAS
    overtime.check_overtime(registers,times)
    //INSERTAR O ACTUALIZAR
    operations.insert_or_update(registers)
    
}

module.exports = {job}