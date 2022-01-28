var Connection = require('tedious').Connection;  
let config = require('./config.js');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use('/', express.static("public"));
app.use('/api/', bodyParser.urlencoded({
    extended: true
}));
app.use('/api/', bodyParser.json());

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected");  
    executeStatement();
    app.post("/api/add",function(req,res){
      let user = req.body.user;
      connection.query("call register(?,?,?,?,?,?,?)", [user, 'sdf','sfdsfd','afds','dfds','are',1833439863], function (err, result) {
        if (err) {
            console.log("err:", err);
        } else {
            console.log("results:", result);
        }
    
    });
    
      
    }) 
    
});  

connection.connect();


function executeStatement() {  
    request = new Request("SELECT * FROM Species", function(err) {  
    if (err) {  
        console.log(err);}  
    });  
    var result = "";  
    request.on('row', function(columns) {  
        columns.forEach(function(column) {  
          if (column.value === null) {  
            console.log('NULL');  
          } else {  
            result+= column.value + " ";  
          }  
        });  
        console.log(result);  
        result ="";  
    });  

    request.on('done', function(rowCount, more) {  
    console.log(rowCount + ' rows returned');  
    });  
    
    // Close the connection after the final event emitted by the request, after the callback passes
    request.on("requestCompleted", function (rowCount, more) {
        connection.close();
    });
    connection.execSql(request);  
}  
app.listen(3000);

    

