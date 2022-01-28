var Connection = require('tedious').Connection;  
var config = {  
    server: 'titan.csse.rose-hulman.edu',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'SodaBasestewarhr', //update me
            password: 'DogCatFish'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:
        encrypt: true,
        database: 'PetCare'  //update me
    }
}; 
var connection = new Connection(config);  
connection.on('connect', function(err) {  
    // If no error, then good to proceed.  
    console.log("Connected");  
    callSProc() //CHANGED
});  

connection.connect();

var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

//Call the Register Stored Procedure
function RegisterSProc(Username, Password, FName, LName, Address, Phone) {
    let sql = `CALL Register`
    //Needs to deal with the Password encryption still
    let fields = `${Username}, ${PasswordSalt}, ${PasswordHash}, ${FName}, ${LName}, ${Phone}, ${Address}` //error on syntax of this line, I think
    connection.query(sql, true, (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
        console.log(results[0]);
      });
      
      connection.end();
}
