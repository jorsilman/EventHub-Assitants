var express = require('express');
var router = express.Router();

var assistans = [
  {
  "id": "1",
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
  name = assistant.name;
  lastName = assistant.lastName;
  email = assistant.email;
  eventId = assistant.eventId;
  /*Generate random alphanumeric code*/
  var code = Math.random().toString(36).substring(7);
  /*JSON with the info of the assistant*/
  var jsonAssistant = {
    "name": name,
    "lastName": lastName,
    "email": email,
    "eventId": eventId,
    "code": code
  };
  console.log(jsonAssistant);

});

/*GET assistant Id*/
router.get('/:id', function(req, res, next) {
  var id = req.params.id;
  var result = assistans.find(c => {
    return c.id === id;
  });
  if(result){
    res.send(result);
  }else{
    res.sendStatus(404);
  }
});

/*PUT assistant by Id*/
router.put('/:id', function(req, res, next) {
  var id = req.params.id;
  var assistant = req.body;
  var result = assistans.find(c => {
    return c.id === id;
  });
  if(result){
    console.log(result);
    result.name = assistant.name;
    result.lastName = assistant.lastName;
    result.email = assistant.email;
    result.eventId = assistant.eventId;
    res.sendStatus(204);
    console.log(result);
  }else{
    res.sendStatus(404);
  }
});

/*DELETE assistant Id*/
router.delete('/:id', function(req, res, next) {
  var id = req.params.id;
  var result = assistans.find(c => {
    return c.id === id;
  });
  if(result){
    assistans = assistans.filter(c => {
      return c.id !== id;
    });
    res.sendStatus(204);
  }else{
    res.sendStatus(404);
  }
});

/*GET assistant by eventId*/
router.get('/event/:eventId', function(req, res, next) {
  var eventId = req.params.eventId;
  var result = assistans.filter(c => {
    return c.eventId === eventId;
  });
  if(result){
    res.send(result);
  }else{
    res.sendStatus(404);
  }
});




module.exports = router;
