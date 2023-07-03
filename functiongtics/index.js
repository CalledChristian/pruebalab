var fs = require('fs');
const path = require("path");
const certLocation = path.resolve(__dirname, "DigiCertGlobalRootCA.crt.pem");
const serverCa = [fs.readFileSync(certLocation, "utf8")];


const mysql = require('mysql2');

const qs = require('qs');

const pool = mysql.createPool({
    host: 'bd-gtics-final.mysql.database.azure.com',
    user: 'admingtics',
    password: 'Maictuvi789',
    database: 'hr',
    port: 3306,
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }
});
const promisePool = pool.promise();



module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    //con xlms - post
    if(req.rawbody){
        let parseData= qs.parse(req.rawbody);
        if(parseData.nombre){
            context.log("Nombre recibido: " + parseData.nombre);
        }
        if(parseData.apellido){
            context.log("Apellido recibido: " +parseData.apellido);
        }
    }

    //con raw-body
    if(req.body){
        if(req.rawbody.nombre)
            context.log("Nombre recibido: "+  req.rawbody.nombre);
        if(req.rawbody.apellido)
            context.log("Nombre recibido: "+  req.rawbody.apellido);
    }

    let nombre = req.query.nombre

    let rows;

    if(nombre!=undefined){
        [rows, fields] = await promisePool.query("SELECT * from employees where first_name = ? ",[nombre]);
    }else{
        [rows, fields] = await promisePool.query("SELECT * from employees");
    }
    
    

    //const [rows, fields] = await promisePool.query("SELECT * from employees");

    context.res = {
        body: {
            success: 'true',
            data: rows
        },
        headers: { 'Content-Type': 'application/json' }
    };

    /*const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200,  Defaults to 200 
        body: responseMessage
    };*/
}