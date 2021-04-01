const connection = require("./db_connection")



exports.last_assist = ()=>{
    return new Promise((resolve,reject)=>{ 
    let query = 'SELECT * FROM assists WHERE id=(SELECT max(id) FROM assists)';
    connection.query(query,(err,rows)=>{
        if(err)  reject(err);
     if(rows.length == 0){
        resolve(0);
     }else{
         resolve(rows[0].uid)
     }
         });
    });

}

exports.get_user_id = (deviceUserId)=>{
    return new Promise((resolve,reject)=>{ 
    let query = `SELECT id FROM users WHERE uid=${deviceUserId}`
    connection.query(query,(err,rows)=>{
        if(err)  reject(err);
        resolve(rows[0].id)
    });
  
    });

}


exports.get_situation_id = (personal_id)=>{
    return new Promise((resolve,reject)=>{
        
       
        let query = `SELECT situation_id FROM linklabor_ugel WHERE personal_id=${personal_id}`
    connection.query(query,(err,rows)=>{
        if(err)  reject(err);
     
     resolve(rows[0].situation_id)
        
    });
  
    });
}

exports.get_schedule = ()=>{
    return new Promise((resolve,reject)=>{ 
    let query = 'SELECT * FROM setting';
    connection.query(query,(err,rows)=>{
        if(err)  reject(err);
        var x = rows[0];
        let times = {
            entry_morning : x.entry_time_tomorrow,
            departure_morning: x.departure_time_tomorrow,
            //HORA CLAVE
            entry_afternoon:x.entry_time_late,
            departure_afternoon:x.departure_time_late,
            minutes:x.late_minutes
        }
    
     resolve(times)
        
    });
  
    });
}

exports.register_exists = async (personal_id,date)=>{
    return new Promise((resolve,reject)=>{
        
        connection.query(`select * from assists where personal_id = ${personal_id} and date=${JSON.stringify(date)}`,(err,row)=>{
            if(err) throw err;
               resolve(row)
        });
    })
}


exports.insert =  async (keys,values)=>{
   let query = `insert into assists (${keys})values(${values.join(',')})`;
        connection.query(query,(err,res)=>{
                if(err) throw err;
                console.log("Nuevo",res.insertId);            
            });
}

exports.update_empty_field = async(property,value,key,id,uid)=>{
    query = `UPDATE assists SET ${property} = JSON_ARRAY(JSON_OBJECT(${key},${value})), uid = ${uid} where id=${id} ` 
       connection.query(query,(err,row)=>{

                    if(err) throw err;
                            console.log("Actualizado campo vacio"); 
                })
}

exports.update_fill_field = async(property,value,key,id,uid)=>{
    query = `UPDATE assists SET ${property} = JSON_ARRAY_INSERT(${property},'$[0]',JSON_OBJECT(${key},${value})), uid = ${uid} where id=${id}`
       connection.query(query,(err,row)=>{

                    if(err) throw err;
                            console.log("Actualizado campo lleno"); 
                })
}

exports.property_filled = async(property,id)=>{
    let query = `SELECT ${property} FROM assists WHERE id=${id}`;
    return new Promise((resolve,_)=>{
        connection.query(query,(err,row)=>{
            if(err) throw err;
           
            resolve( row[0][property] !== null)
        })
    })
    
}