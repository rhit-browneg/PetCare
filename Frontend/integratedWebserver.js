var Connection = require('tedious').Connection;
let config = require('./config.js');
config.options.rowCollectionOnDone = true;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
var crypto = require('crypto');
const {
  json
} = require('express');



app.use('/', express.static("public"));
app.use('/api/', bodyParser.urlencoded({
  extended: true
}));
app.use('/api/', bodyParser.json());

var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var connection = new Connection(config);
connection.on('connect', function (err) {
  // If no error, then good to proceed.  
  console.log("Connected");
  //executeStatement();
  app.post("/api/reg", function (req, res) {
    let json = {};
    let user = req.body.user;
    let pass = req.body.pass;
    let fName = req.body.fName;
    let lName = req.body.lName;
    let address = req.body.address;
    let phone = req.body.phone;
    let salt = createSalt();
    let hash = hashPassword(pass, salt);
    request = new Request('register', function (err) {
      if (err) {
        console.log(err);
      }
    });
    request.addParameter('Username', TYPES.NVarChar, user);
    request.addParameter('PasswordSalt', TYPES.VarChar, salt);
    request.addParameter('PasswordHash', TYPES.VarChar, hash);
    request.addParameter('fname', TYPES.VarChar, fName);
    request.addParameter('lname', TYPES.VarChar, lName);
    request.addParameter('address', TYPES.VarChar, address);
    request.addParameter('number', TYPES.Int, phone);
    if (phone === TYPES.Int && user != null && fName != null && lName != null && address != null) {
      json[0] = "success";
    }
    res.send(json);
    connection.callProcedure(request);
  });
  app.post("/api/log", function (req, res) {
    let user = req.body.user;
    let pass = req.body.pass;
    request = new Request('check_passwords', function (err) {
      if (err) {
        console.log(err);
      }
    });
    request.addParameter('username', TYPES.NVarChar, user);
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
  app.post("/api/addpet", function (req, res) {
    let data   ={
      "user": req.body.ownerusername
    }
    let name = req.body.petName;
    let type = req.body.type;
    let sex = req.body.sex;
    let breed = req.body.breed;
    let dob = req.body.dob;
    let ownerusername = req.body.ownerusername;
    console.log(name + " " + ownerusername);
    request = new Request('add_pet', function (err) {
      if (err) {
        console.log(err);
      }

    });
    request.addParameter('petName', TYPES.NVarChar, name);
    request.addParameter('type', TYPES.VarChar, type);
    request.addParameter('sex', TYPES.VarChar, sex);
    request.addParameter('breed', TYPES.VarChar, breed);
    request.addParameter('dob', TYPES.Date, dob);
    request.addParameter('ownerusernme', TYPES.VarChar, ownerusername);
    request.on('doneProc', function (rowCount, more, returnStatus, rows) {
      res.send(data);
      res.end;
    });
    connection.callProcedure(request);
  });
  app.get("/api/user/:id", function (req, res) {
    let user = req.params.id;
    let FName = null;
    let LName = null;
    let Address = null;
    let Phone = null;
    request = new Request('get_user_info', function (err) {
      if (err) {
        console.log(err);
      }
    });
    request.addParameter('username', TYPES.NVarChar, user);
    request.on('row', (columns) => {
      FName = columns[0].value;
      Phone = columns[1].value;
      Address = columns[2].value;
      LName = columns[3].value;
    });
    request.on('doneProc', function (rowCount, more, returnStatus, rows) {
      let result = {
        "FName": FName,
        "LName": LName,
        "Address": Address,
        "Phone": Phone
      }
      res.send(result);
    });
    connection.callProcedure(request);

  });
  app.post("/api/getpets", function (req, res) {
    let user = req.body.user;
    request = new Request('get_pet_info', function (err) {
      if (err) {
        console.log(err);
      }
    });
    jsonArray = [];
    request.addParameter('username', TYPES.NVarChar, user);
    request.on('row', (columns) => {
      var pet = {};
      columns.forEach(function (column) {
        pet[column.metadata.colName] = column.value;
      });
      jsonArray.push(pet)
    });
    request.on('doneProc', function (rowCount, more, returnStatus, rows) {
      console.log(jsonArray);
      res.send(jsonArray);
      res.end();
    });
    connection.callProcedure(request);
  })
  app.post("/api/getpet", function (req, res) {
    let user = req.body.user;
    request = new Request('get_pet_info_dob', function (err) {
      if (err) {
        console.log(err);
      }
    });
    jsonArray = [];
    request.addParameter('username', TYPES.NVarChar, user);
    request.on('row', (columns) => {
      var pet = {};
      columns.forEach(function (column) {
        pet[column.metadata.colName] = column.value;
      });
      jsonArray.push(pet)
    });
    request.on('doneProc', function (rowCount, more, returnStatus, rows) {
      console.log(jsonArray);
      res.send(jsonArray);
      res.end();
    });
    connection.callProcedure(request);
  })
  app.post("/api/editpet", function (req, res) {
    let name = req.body.petName;
    let type = req.body.type;
    let sex = req.body.sex;
    let breed = req.body.breed;
    let dob = req.body.dob;
    let ownerusername = req.body.ownerusername;
    console.log(name + " " + ownerusername);
    request = new Request('edit_pet', function (err) {
      if (err) {
        console.log(err);
      }

  });
  request.addParameter('name', TYPES.NVarChar, name);
  request.addParameter('type', TYPES.VarChar, type);
  request.addParameter('sex', TYPES.VarChar, sex);
  request.addParameter('breed', TYPES.VarChar, breed);
  request.addParameter('dob', TYPES.Date, dob);
  request.addParameter('ownerusernme', TYPES.VarChar, ownerusername);
connection.callProcedure(request);
});
app.put("/api/editUser/:id", function (req, res) {
  let oldusername = req.params.id;
  let fname = req.body.fName;
  let lname = req.body.lName;
  let address = req.body.address;
  let phoneNum = req.body.phone;
  request = new Request('edit_user', function (err) {
    if (err) {
      console.log(err);
    }
  });
  request.addParameter('currentUsername', TYPES.NVarChar, oldusername);
  request.addParameter('FName', TYPES.VarChar, fname);
  request.addParameter('LName', TYPES.VarChar, lname);
  request.addParameter('Address', TYPES.NVarChar, address);
  request.addParameter('PhoneNumber', TYPES.VarChar, phoneNum);
  request.on('doneProc', function (rowCount, more, returnStatus, rows) {
    let setData = {
      "user": oldusername
    }
    res.send(setData);
    res.end();
  });
  connection.callProcedure(request);
});
app.delete("/api/deleteUser/:id",function(req,res){
let user = req.params.id;
request = new Request('delete_user', function (err) {
  if (err) {
    console.log(err);
  }
});
request.addParameter('username',TYPES.NVarChar,user);
connection.callProcedure(request);

})
app.post("/api/deletepet", function (req, res) {
  let name = req.body.petName;
  let ownerusername = req.body.ownerusername;
  console.log(name + " " + ownerusername);
  request = new Request('delete_pet', function (err) {
    if (err) {
      console.log(err);
    }

});
request.addParameter('petName', TYPES.NVarChar, name);
request.addParameter('ownerusernme', TYPES.VarChar, ownerusername);
connection.callProcedure(request);
});
app.put("/api/editPassword/:id", function (req, res) {
  let username = req.params.id;
  let password = req.body.password;
  let salt = createSalt();
  let hash = hashPassword(password,salt);
  request = new Request('edit_password', function (err) {
    if (err) {
      console.log(err);
    }
  });
  request.addParameter('username', TYPES.NVarChar, username);
  request.addParameter('salt', TYPES.VarChar, salt);
  request.addParameter('hash',TYPES.NVarChar,hash);
  request.on('doneProc', function (rowCount, more, returnStatus, rows) {
    let setData = {
      "user": username
    }
    res.send(setData);
    res.end();
  });
  connection.callProcedure(request);
});
});

connection.connect();


function createSalt() {
  return crypto.randomBytes(Math.ceil(16 / 2))
    .toString('hex')
    .slice(0, 16);
};

function hashPassword(pass, salt) {
  var hash = crypto.createHmac('sha1', salt); /** Hashing algorithm sha512 */
  hash.update(pass);
  var value = hash.digest('hex');
  return value;
};

function executeStatement() {
  request = new Request("SELECT * FROM Pet", function (err) {
    if (err) {
      console.log(err);
    }
  });
  var result = "";
  request.on('row', function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log('NULL');
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  request.on('done', function (rowCount, more) {
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