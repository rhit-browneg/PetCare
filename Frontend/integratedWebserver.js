var Connection = require('tedious').Connection;  
let config = require('./config.js');
config.options.rowCollectionOnDone = true;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var crypto = require('crypto');
const { json } = require('express');
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
    //executeStatement();
    app.post("/api/reg",function(req,res){
      let user = req.body.user;
      let pass = req.body.pass;
      let fName = req.body.fName;
      let lName = req.body.lName;
      let address = req.body.address;
      let phone = req.body.phone;
      let salt = createSalt();
      let hash = hashPassword(pass,salt);
      request = new Request('register', function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        request.addParameter('Username',TYPES.NVarChar,user);
        request.addParameter('PasswordSalt',TYPES.VarChar,salt);
        request.addParameter('PasswordHash',TYPES.VarChar,hash);
        request.addParameter('fname',TYPES.VarChar,fName);
        request.addParameter('lname',TYPES.VarChar,lName);
        request.addParameter('address',TYPES.VarChar,address);
        request.addParameter('number', TYPES.Int,phone);
        connection.callProcedure(request); 
    }) ;
    app.post("/api/log",function(req,res){
      let user = req.body.user;
      let pass = req.body.pass;
      request = new Request('check_passwords', function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        request.addParameter('username',TYPES.NVarChar,user);
        var json = {};
        let salt = null;
        let hash = null;
        request.on('row', (columns) => {
          salt = columns[0].value;
          hash = columns[1].value;
          json[columns[1].metadata.colName] = columns[1].value;
        });
        request.on('doneProc', function (rowCount, more, returnStatus, rows) { 
          console.log("done");
          if (pass != null && hash != null) {
            let hashedpass = hashPassword(pass, salt);
            json["hash"] = hashedpass;
          }
          res.send(json);
        });
        connection.callProcedure(request);
    })
    app.post("/api/getpets", function(req, res){
      let user = req.body.user;
      request = new Request('get_pet_info', function(err) {  
        if (err) {  
            console.log(err);}  
        });  
        jsonArray = [];
        request.addParameter('username',TYPES.NVarChar,user);
        request.on('row', (columns) => {
          var pet ={};
          columns.forEach(function(column) {
              pet[column.metadata.colName] = column.value;
          });
          jsonArray.push(pet)
        });
        request.on('doneProc', function (rowCount, more, returnStatus, rows) { 
          console.log(jsonArray);
          res.send(jsonArray);
        });
        connection.callProcedure(request);
    })
});  

connection.connect();


function createSalt(){
  return crypto.randomBytes(Math.ceil(16/2))
      .toString('hex')
      .slice(0,16);   
};
function hashPassword(pass,salt){
  var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
      hash.update(pass);
      var value = hash.digest('hex');
       return value;
};
function executeStatement() {  
    request = new Request("SELECT * FROM Pet", function(err) {  
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
      //connection.close();
    });
    connection.execSql(request);  
}  
app.listen(3000);
connection.close();

    

