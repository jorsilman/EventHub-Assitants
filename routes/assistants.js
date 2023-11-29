var express = require('express');
var router = express.Router();

var assistans = [
  {
  "name": "Jorge", 
  "lastName": "Sillero", 
  "email":"jorgesilleromanchon@gmail.com", 
  "eventId": "1"
  }
]

/* GET assistants listing. */
router.get('/', function(req, res, next) {
  res.send(assistans);
});

/*POST assistants */
router.post('/', function(req, res, next) {
  var assistant = req.body;
  assistans.push(assistant);
  res.sendStatus(201);
});

/*GET assistant Id*/
router.get('/:name', function(req, res, next) {
  var name = req.params.name;
  var result = assistans.find(c => {
    return c.name === name;
  });
  if(result){
    res.send(result);
  }else{
    res.sendStatus(404);
  }
});




module.exports = router;
