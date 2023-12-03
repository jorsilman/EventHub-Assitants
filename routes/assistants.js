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

  /* Crear una promesa para la llamada a random.org */
  var getRandomCode = new Promise(function(resolve, reject) {
    var request = require('request');
    var url = 'https://api.random.org/json-rpc/4/invoke';
    var options = {
      uri: url,
      method: 'POST',
      json: {
        "jsonrpc": "2.0",
        "method": "generateStrings",
        "params": {
          "apiKey": "52ebd838-f349-49d6-98bf-5d28623752d3",
          "n": 1,
          "length": 5,
          "characters": "abcdefghijklmnopqrstuvwxyz0123456789"
        },
        "id": 1
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var code = body.result.random.data;
        console.log(code);
        resolve(code); // Resuelve la promesa con el código
      } else {
        reject(error); // Rechaza la promesa con el error
      }
    });
  });

  /* Utilizar la promesa para obtener el código y construir el objeto jsonAssistant */
  getRandomCode.then(function(code) {
    var jsonAssistant = {
      "name": name,
      "lastName": lastName,
      "email": email,
      "eventId": eventId,
      "code": code
    };
    console.log(jsonAssistant);
  }).catch(function(error) {
    console.error("Error al obtener el código:", error);
  });
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

/*GET assistants by eventId*/
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
