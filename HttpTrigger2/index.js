//leer el certificado SSL con fs
var fs = require('fs');
const path = require("path");
const certLocation = path.resolve(__dirname, "DigiCertGlobalRootCA.crt.pem");
const serverCa = [fs.readFileSync(certLocation, "utf8")];


//conexión a mysql
const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'bd2.mysql.database.azure.com',
    user: 'adminbd',
    password: 'Maictuvi123',
    database: 'hr',
    port: 3306,
    //para el certificado ssl ,se agrega
    ssl: {
        rejectUnauthorized: true,
        ca: serverCa
    }

});
const promisePool = pool.promise();


//funcion por defecto
module.exports = async function (context, req) {
    

    context.log('JavaScript HTTP trigger function processed a request.');

    const [rows, fields] = await promisePool.query("SELECT * from employees");

    context.res = {
        body: {
            success: 'true',
            data: rows
        },
        headers: { 'Content-Type': 'application/json' }
    };

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". This HTTP triggered function executed successfully."
        : "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.";

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}