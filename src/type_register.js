const utils = require('./utils');

function type_register(registers,times){
    var entry_limit = times.departure_morning;
    var departure_limit = times.entry_afternoon;
 
    for(var i = 0 ; i < registers.length ; i ++){
        let register = registers[i];
        let register_recordTime = new Date(register.recordTime);

        if(register.type == "Check-in"){
         let limit =  utils.date_limit(register_recordTime,entry_limit);
      
            if(limit.getTime()>register_recordTime.getTime()){
                register.entry_morning = register_recordTime;
            }else{
                register.entry_afternoon = register_recordTime;
            }
        }else{
            let limit =  utils.date_limit(register_recordTime,departure_limit);
           
            if(limit.getTime()>register_recordTime.getTime()){
                register.departure_morning = register_recordTime;         
            }else{
                register.departure_afternoon = register_recordTime;             
            }
        }

    }
}

module.exports = type_register