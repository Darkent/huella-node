const express = require ("express");
const app = express();
const job = require("./src/job");
app.listen(5000,()=>{
    console.log("El servidor esta corriendo");
});



job.job("asistencia")


