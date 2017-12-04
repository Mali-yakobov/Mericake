'use strict';
var application_root = __dirname;
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/Mericake";
var crypto = require('crypto');

app.use(bodyParser.json());
app.use(express.static(path.join(application_root, "public")));
app.listen(3000, function () {
  console.log('app listening on port 3000!')
})

app.post('/login', function (req, res) {
	var hashedPass = saltHashPassword(req.body['pass']);
	
		MongoClient.connect(url, function(err, db){
			  if (err) throw err;
			  db.collection('userscollection').save( { user: req.body['user'] , pass: hashedPass, reservations: req.body['reservations']}), 
			  function(err, result) {
			  	console.log(err);
			  }
			  db.close();
	  });
	  
	
});

app.post('/order', function (req, res) {
	console.log(req.body['newReservation']);
		MongoClient.connect(url, function(err, db){
			  if (err) throw err;
 
			 db.collection('userscollection').update(
			   {  user: req.body['user']   },
			   {$push : {reservations : req.body['newReservation'] }});
				db.close(); 

	  });
	  
	
});

app.post('/cart', function (req, res) {
	
		MongoClient.connect(url, function(err, db){
			  if (err) throw err;
			  db.collection('userscollection').findOne( { user: req.body['user']}, 
			  function(err, result) {
			  	res.send(JSON.stringify(result['reservations']));
			  	
			  });
			  db.close();
			 
	  });
	  
	
});

/**
 * generates random string of characters i.e salt
 */
var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

var sha512 = function(password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

function saltHashPassword(userpassword) {
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha512(userpassword, salt);
   //console.log('UserPassword = '+userpassword);
    //console.log('Passwordhash = '+passwordData.passwordHash);
    //console.log('nSalt = '+passwordData.salt);

    return passwordData.passwordHash;
}