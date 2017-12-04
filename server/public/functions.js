/**
 * Created by Mali on 12/10/2016.
 */
var user, password;


function onLogin(){
    user = $('#username').val();
    password = $('#password').val();
    localStorage.setItem("user", user);
    
    $.ajax({
    url: 'http://localhost:3000/login', // Node.js Server REST Call
    type: "POST",
    data: JSON.stringify({"user": user,"pass": password, "reservations": []}),
    contentType: "application/json",
    //dataType: "json",
    success: function(seed) {

      }
  }); 
  document.getElementById('login_f').style.display='none';
  $("#carousel-example-generic").css('opacity', 1);
  $("#menu").css('opacity', 1);
  
}

function dataUpdate(){
  var user = localStorage.getItem("user");
    var res;
           $.ajax({
              url: 'http://localhost:3000/cart', // Node.js Server REST Call
              type: "POST",
              data: JSON.stringify({"user": user}),
              contentType: "application/json",
              //dataType: "json",
              success: function(seed) {
                console.log(seed);

                var res = JSON.parse(seed);
               // localStorage.setItem("reservations", res);
                chartSum(res);
          
              }
            }); 
}

function chartSum(res){
  var reservationsData = {};
  var totalPrice = 0;
  reservationsData["count"] = res.length;
  res.forEach(function(item){
    totalPrice += item.price;
  });
  reservationsData["price"] = totalPrice;
}

function onOrder(productName, price){
  var date = new Date();
  var day = date.getDate(), month = date.getMonth();
  var reservationDate = day + '/' + month;
  var user = localStorage.getItem("user");
           $.ajax({
    url: 'http://localhost:3000/order', // Node.js Server REST Call
    type: "POST",
    data: JSON.stringify({"user": user, "newReservation": {ProductName: productName, Price: price, Date: reservationDate} }),
    contentType: "application/json",
    //dataType: "json",
    success: function(seed) {

      }
  }); 
       
//add popup that verify order
  
}

function onCartClick(){
  debugger
    var user = localStorage.getItem("user");
    var res;
           $.ajax({
              url: 'http://localhost:3000/cart', // Node.js Server REST Call
              type: "POST",
              data: JSON.stringify({"user": user}),
              contentType: "application/json",
              //dataType: "json",
              success: function(seed) {
                console.log(seed);

                var res = JSON.parse(seed);
                //localStorage.setItem("reservations", res);
                showReservation(res);
          
              }
            }); 
 
 
}

function showReservation(){
  var reservations = localStorage.getItem("reservations");
        
          var tbody = $('#reservations'),
            props = ["ProductName", "Price", "Date"];
        $.each(reservations, function(i, reservation) {
          var tr = $('<tr>');
          $.each(props, function(i, prop) {
            $('<td>').html(reservation[prop]).appendTo(tr);  
          });
          tbody.append(tr);
        });
        
}

function onClickLogin(){
  document.getElementById('login_f').style.display='block';
  $("#carousel-example-generic").css('opacity', 0.5);
  $("#menu").css('opacity', 0.5);
}

function onCancel(){
    document.getElementById('login_f').style.display='none';
     $("#carousel-example-generic").css('opacity', 1);
     $("#menu").css('opacity', 1);   
}


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
    console.log('UserPassword = '+userpassword);
    console.log('Passwordhash = '+passwordData.passwordHash);
    console.log('nSalt = '+passwordData.salt);

    return passwordData.passwordHash;
}