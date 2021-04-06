function change_time(registers){
    registers.forEach((register)=>{
        let date = new Date(register.recordTime);
        date.setHours(date.getHours()-5);
        register.recordTime = date;
    })
    return registers;
}

function date_limit(register_date,limit_date){
    let register_date_string = register_date.toISOString();
    let y_m_d = register_date_string.split("T")[0];
    let rest = ":00.000Z";
    let date = "".concat(y_m_d,"T",limit_date,rest);
  
    return new Date(y_m_d.concat("T",limit_date,rest));
}

function add_fields(registers){
    for(var i = 0 ; i < registers.length ; i ++){
        let register = registers[i];
        let date_register = register.recordTime.toISOString();
        //
        let month = date_register.split("-")[1];
        let date = date_register.split("T")[0].split("-").reverse().join("-");
        let institution_id = 1;
        let ballot_id = 0;
        let hour = 0;
        let uid = register.userSn;
        //
        register.date = date;
        register.month = month;
        register.hour = hour;
        register.ballot_id = ballot_id;
        register.institution_id = institution_id;
        register.uid = uid;

        delete register.userSn;
   
       
    }
}
 function property_is(register){
    if(register.hasOwnProperty('entry_morning')){
            return 'entry_morning'
      }else if(register.hasOwnProperty('entry_afternoon')){
             return 'entry_afternoon';
      }else if(register.hasOwnProperty('departure_morning')){
             return 'departure_morning';
      }else{
            return 'departure_afternoon';
      }
 }
module.exports = {change_time,date_limit,add_fields,property_is}