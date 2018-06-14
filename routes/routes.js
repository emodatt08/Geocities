var express = require('express');
var bodyParser = require('body-parser');
var mongojs = require("mongojs");
var ObjectId = mongojs.ObjectId;
var router = express.Router();
//var db = mongojs('react', ['users']);
var db = mongojs('grocery', ['users']);

router.get('/demo', function(req, res){
    var data = [
        {"username": "emodatt08", "age": "16", "hobbies":"video games"},
        {"username": "Jamoo", "age": "23", "hobbies":"reading"},
        {"username": "dietrack", "age": "34", "hobbies":"football"}
        ];
    return res.json(data);
});


router.post("/users", function(req, res){
    console.log("registering a user");
    var parame = req.body;
    
    var parameters = {
        "username":parame.username,
        "age": parame.age,
        "hobbies": parame.hobbies
    }
    
db.users.insert(parameters, function (err, result) {
if(err){
    console.log(err)
    res.json({"responseCode":"00","responseMsg":err});
}
    res.json({"responseCode":"01","responseMsg":"Success"});
});

});

router.get("/users", function(req, res){
    db.users.find(function(err, details){
        res.json(details);
    });
});

router.post('/login', function(req, res){
    console.log(JSON.stringify(req.body));
    var parame = req.body;
    var parameters = {
        "email":parame.username,
        "password": parame.password
       
    }
    
    db.users.find(parameters).forEach(function (err, doc) {

	if (!doc) {
            res.json({"data":{"responseCode": "01", "responseMsg":"Cannot find details about this account"}});
        }else{
            res.json({"data":{"responseCode":"00","responseMsg":"Success"}});
            
           
        }
    });
});



router.post('/grocery/add', function(req, res){
    console.log("adding groceries");
    var parame = req.body;
    var parameters = {

        "name":parame.Name
                    
    }
    
    db.groceries.insert(parameters, function (err, doc) {

	if (!doc) {
            res.json({"data":{"responseCode": "01", "responseMsg":"Grocery product failed to store"}});
        }else{
            res.json({"data":{"responseCode":"00","responseMsg":"Grocery product saved", "data": doc}});
            
           
        }
    });
});

router.get('/grocery', function(req, res){
    console.log("getting grocery....");

    db.groceries.find(function(err, doc){
        if(doc){
            res.json({"data":{"responseCode":"00","responseMsg":"Success", "data": doc}})
        }
});

});



module.exports = router;