const utils = require('./utils');

function check_overtime(registers, times){
   
    for(var i = 0 ; i < registers.length ; i ++){
        let register = registers[i];
        let type_times = times.filter((time)=>time.user_type == register.type_user.toString())[0];
        let time = {
            entry_morning:type_times.entry_morning,
            departure_morning :type_times.departure_morning,
            entry_afternoon:type_times.entry_afternoon,
            departure_afternoon:type_times.departure_afternoon,
            minutes:type_times.overtime_minutes
        }
        if(register.hasOwnProperty('entry_morning')){
          let check_overtime =   is_overtime(time.entry_morning,register.entry_morning,time.minutes)
          let property = check_overtime ? "tarde":"hora";
          register.entry_morning = {[property]:cut_date(register.entry_morning)}
         
        }else if(register.hasOwnProperty('entry_afternoon')){
          let check_overtime =   is_overtime(time.entry_afternoon,register.entry_afternoon,time.minutes)
          let property = check_overtime ? "tarde":"hora";
          register.entry_afternoon = {[property]:cut_date(register.entry_afternoon)}
        
        }else if(register.hasOwnProperty('departure_morning')){
            register.departure_morning = {"hora":cut_date(register.departure_morning)}
        }else{
            register.departure_afternoon = {"hora":cut_date(register.departure_afternoon)}
        }
        delete register.recordTime;
        delete register.deviceUserId;
        delete register.name;
        delete register.type;
    }
    

}
//CORTAR LA FECHA PARA OBTENER SOLO LA HORA
function cut_date(register_date){
    let register_date_string = register_date.toISOString();
    let split_date = register_date_string.split("T")[1];
    let split_time = split_date.split(".")[0];
    return split_time;
}
//DEVUELVE TRUE SI ES TARDANZA
function is_overtime(limit,register_date,minutes){
    let register_date_string = register_date.toISOString();
    let y_m_d = register_date_string.split("T")[0];
    let rest = ":00.000Z";
    let date = new Date(y_m_d.concat("T",limit,rest));
    date.setMinutes(date.getMinutes()+minutes);
    return register_date.getTime() > date.getTime();
}

module.exports = {check_overtime}