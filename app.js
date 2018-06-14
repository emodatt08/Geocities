/**
 * Importing core web node modules
 *
 */
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
var routes = require("./routes/routes");
var ObjectId = mongojs.ObjectId;

/**
 * connect to database 
 *
 */

var db = mongojs('geocity', ['country']);

/**
 * Initializing express 
 *
 */
var app = express();

/**
 * Setting the app to listen on port 5000
 *
 */
app.listen(5000, function(){
        console.log("listening on port....5000");
});

// /**
//  * creating a middleware
//  *@return next()
//  */
// var logger = function(req, res, next){
//     console.log("writing to file....");
//     next();
// }

// /**
//  * implementing a middleware
//  *
//  */

/**
 * view Template
 *
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



/**
 * BodyParser middleware
 *
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}));


/**
 * Setting the static path
 *
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Global middleware for Errors
 *
 */
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});


/**
 * Express Validator Middleware
 *@params req.params
 */
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));



app.use(function(req,res,next){
  var _send = res.send;
  var sent = false;
  res.send = function(data){
    if(sent) return;
    _send.bind(res)(data);
    sent = true;
};
  next();
});




 app.use('/', routes);

/**
 * Implementing a route
 *@return index
 *@param geocities
 */
app.get('/', function(req, res){
    var header ="geocities";
  

 db.country.find(function (err, docs) {
	//console.log(docs);
     res.render("index", {title:header, geo:docs});
})

   
});

/**
 * Implementing a route
 *@return json
 *@param person
 */
app.get("/users", function(req, res){
   var person = [{"first_name":"Jamoo", "age":"34"}, {"first_name":"David", "age": "26"}];
    res.json(person);
});

/**
 * Implementing a delete route
 *
 *
 */
app.delete("/geo/delete/:id", function(req, res){
      
      db.country.remove({_id: ObjectId(req.params.id)}, function(err, result){
                if(err){
                console.log("Error: " + err);
                }else{
                    res.redirect("/");
                }
      });
});


/**
 * Implementing a route
 *@return geocities
 *@param geocities
 */
app.post("/geo/add", function(req, res){

//check for empty fields
req.checkBody('country', 'Country is required').notEmpty();
req.checkBody('city', 'City field must not be empty').notEmpty();

//escape sql_injection 
req.sanitize('country').escape();
req.sanitize('city').escape();

//trim fields
req.sanitize('city').trim(); 
req.sanitize('country').trim();

var errors = req.validationErrors();
if(errors){
console.log("errors");
 var geocities = 
[
    {
    "country":"Italy", 
    "city":"rome"
},
    {
    "country":"Nigeria", 
    "city":"lagos"
    },

];
res.render("index", {errors:errors, geo:geocities});
    
}else{

var geocities = 

    {
    "country":req.body.country, 
    "city":req.body.city
    };


 db.country.insert(geocities, function (err, result) {
if(err){
    console.log(err)

}
res.redirect("/");
})

}


});