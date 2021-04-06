const querys = require("./db_querys");
const {list_assists} = require("./repository");
const utils = require("./utils");
const type_register = require("./type_register");
const users_id = require('./users_ids');
const type_user = require('./type_user');
const situations_id = require('./situations_ids');
const overtime = require('./overtime');
const operations = require('./insert_update');
const register_original = require('./registers');
const connection = require("./db_connection")
const job = async (database)=>{
  connection.changeUser({database:database},(err)=>{
    if(err){
      console.log(err);
      return;
    }else{
      console.log("Conectado a",database);
    }
  })
  var last = await querys.test();
 console.log(last);
 return;
    //OBTENIENDO EL ULTIMO REGISTRO
    var last_register = await querys.last_assist();
    // var originals = register_original.test();
    // var registers = originals.filter((register)=>register.userSn > last_register);
    //OBTENIENDO LA LISTA DE REGISTROS Y FILTRANDO POR EL ULTIMO REGISTRO
    var registers = list_assists.filter((register)=>register.userSn > last_register);

   
   
    //VERIFICAR SI HAY REGISTROS
    if(registers.length == 0){
        console.log("Sin nuevos registros");
        querys.close_connection();
        return;
    }
    //QUITANDO 5 HORAS POR LA ZONA
    registers = utils.change_time(registers);
    //SET DE DEVICEUSERID
    let deviceUserIds = Array.from(new Set(registers.map((register)=>register.deviceUserId)));
    //TRAER DE LA DB LOS USERS ID SEGUN EL DEVICEUSERID 
    let personal_ids = await users_id.get_users_ids(deviceUserIds);
    //TRAER DE LA DB LOS SITUATION_ID SEGUN LOS PERSONAL_IDS
    let situtation_ids = await situations_id.get_situations_ids(personal_ids);
    //TRAER DE LA DB LOS TIPOS DE USUARIOS
    let type_users = await type_user.get_types_users(deviceUserIds);
    //AGREGAR TIPO DE USUARIOS
    type_user.add_type_user(registers,type_users);
    //AGREGAR PERSONAL ID
    users_id.add_personal_id(registers,personal_ids);
    //AGREAR SITUATION ID
    situations_id.add_situation_id(registers,situtation_ids)
    //AGREGAR LOS DEMAS CAMPOS 
    utils.add_fields(registers)
    //OBTENIENDO LOS LIMITES
    var times = await querys.get_schedule();
    //TIPO DE REGISTRO
    type_register(registers,times);
    //CHECAR TARDANZAS
    overtime.check_overtime(registers,times)
    //INSERTAR O ACTUALIZAR
  await  operations.insert_or_update(registers)
    //CERRAR CONEXION
    querys.close_connection();
}

module.exports = {job}