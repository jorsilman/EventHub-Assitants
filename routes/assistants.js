var express = require('express');
const Assistant = require('../models/assistant');
var router = express.Router();


var debug = require('debug')('contacts-2:server');

/* GET assistants listing. */
router.get('/', async function(req, res, next) {
  try {
    const result = await Assistant.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST assistants CON PROMESA*/
/*
router.post('/', async function(req, res, next) {
  const { name, surname, email, eventId } = req.body;

  // Crear una promesa para la llamada a random.org

  const getRandomCode = new Promise(function(resolve, reject) {
    const url = 'https://api.random.org/json-rpc/4/invoke';
    const options = {
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
      console.log("SIIIIIIIIII");

      if (!error && response.statusCode == 200) {
        const code = body.result.random.data;
        console.log(code);
        resolve(code); // Resuelve la promesa con el código
      } else {
        reject(error); // Rechaza la promesa con el error
      }
    });
  });

  try {
    // Ejecutar la promesa y esperar la respuesta antes de continuar
    const code = await getRandomCode;

    // Crear una instancia del modelo Assistant con los datos proporcionados
    const assistant = new Assistant({
      name,
      surname,
      email,
      eventId,
      code
    });
    

    // Guardar la instancia del modelo en la base de datos
    await assistant.save();
    // Enviar respuesta exitosa al cliente
    res.sendStatus(201);
  } catch(e) {
    if (e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    } else {
      debug("DB problem", e);
      res.sendStatus(500);
    }
  }
});

*/

/* POST assistants */
router.post('/', async function(req, res, next) {
  const { name, surname, email, eventId } = req.body;

  try {
    // Crear una instancia del modelo Assistant con los datos proporcionados
    const assistant = new Assistant({
      name,
      surname,
      email,
      eventId
    });

    // Guardar la instancia del modelo en la base de datos
    await assistant.save();
    // Enviar respuesta exitosa al cliente
    res.sendStatus(201);
  } catch(e) {
    if (e.errors) {
      debug("Validation problem when saving");
      res.status(400).send({error: e.message});
    } else {
      debug("DB problem", e);
      res.sendStatus(500);
    }
  }
});



/* GET assistant by Id */
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    // Buscar el asistente en la base de datos por su ID
    const result = await Assistant.findById(id);

    // Verificar si se encontró el asistente
    if (result) {
      // Enviar el asistente como respuesta al cliente
      res.send(result);
    } else {
      // Enviar un código de estado 404 si el asistente no se encuentra
      res.sendStatus(404);
    }
  } catch (e) {
    // Manejar cualquier error que ocurra durante la búsqueda
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* PUT assistant by Id */
router.put('/:id', async function(req, res, next) {
  const id = req.params.id;
  const updatedAssistant = req.body;

  try {
    // Buscar el asistente en la base de datos por su ID
    const result = await Assistant.findById(id);

    // Verificar si se encontró el asistente
    if (result) {
      // Actualizar los datos del asistente con los proporcionados en la solicitud
      result.name = updatedAssistant.name;
      result.surname = updatedAssistant.surname;
      result.email = updatedAssistant.email;
      result.eventId = updatedAssistant.eventId;

      // Guardar los cambios en la base de datos
      await result.save();

      // Enviar un código de estado 204 (Sin Contenido) como respuesta al cliente
      res.sendStatus(204);
    } else {
      // Enviar un código de estado 404 si el asistente no se encuentra
      res.sendStatus(404);
    }
  } catch (e) {
    // Manejar cualquier error que ocurra durante la actualización
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* DELETE assistant by Id */
router.delete('/:id', async function(req, res, next) {
  const id = req.params.id;
  console.log(id);

  try {
    const result = await Assistant.findByIdAndRemove(id);
    if (result) {
      console.log("CASI ELIMINADO");
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  } catch (e) {
    // Manejar cualquier error que ocurra durante la eliminación
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/*GET assistants by eventId*/
router.get('/event/:eventId', async function(req, res, next) {
  try {
    const eventId = req.params.eventId;

    // Buscar todos los asistentes con el eventId proporcionado
    const result = await Assistant.find({ eventId });

    if (result.length > 0) {
      // Si se encuentran asistentes, enviar la respuesta al cliente
      res.send(result);
    } else {
      // Si no se encuentran asistentes, enviar un código de estado 404
      res.sendStatus(404);
    }
  } catch (error) {
    // Manejar errores de manera adecuada
    console.error('Error al obtener asistentes por evento:', error);
    res.sendStatus(500);
  }
});

module.exports = router;
