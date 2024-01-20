var express = require('express');
const Assistant = require('../models/assistant');
var router = express.Router();
const axios = require('axios');

var passport = require('passport');


var debug = require('debug')('contacts-2:server');

/* GET assistants listing. FUNCIONA*/
router.get('/', async function(req, res, next) {
  try {
    const result = await Assistant.find();
    res.send(result.map((c) => c.cleanup()));
  } catch(e) {
    debug("DB problem", e);
    res.sendStatus(500);
  }
});

/* POST assistants FUNCIONA*/
router.post('/', 
  passport.authenticate('bearer', { session: false }),  
  async function(req, res, next) {
  const { name, surname, email, eventId, username } = req.body;

   /*code es un string de 5 caracteres alfanuméricos aleatorios*/
  const code = Math.random().toString(36).substring(2, 7);


  try {
    // Crear una instancia del modelo Assistant con los datos proporcionados
    const assistant = new Assistant({
      name,
      surname,
      email,
      eventId,
      username,
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



/* GET assistant by Id FUNCIONA*/
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

/* PUT assistant by Id FUNCIONA*/
router.put('/:id',
  passport.authenticate('bearer', { session: false }),
  async function(req, res, next) {
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
      result.username = updatedAssistant.username;

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

    // Verificar si el error indica que el asistente no fue encontrado
    if (e.name === "CastError" && e.kind === "ObjectId" && e.path === "_id" && e.value === id) {
        res.sendStatus(404);  // Enviar código 404 si el ID no fue encontrado
    } else {
        res.sendStatus(500);  // Enviar código 500 para otros errores
    }
  }
});
// PUT assistant by Name
router.put('/name/:name', async function(req, res, next) {
  const name = req.params.name;
  const updatedAssistant = req.body;

  try {
    // Buscar el asistente en la base de datos por su nombre
    const result = await Assistant.findOne({ name });

    // Verificar si se encontró el asistente
    if (result) {
      // Actualizar los datos del asistente con los proporcionados en la solicitud
      result.name = updatedAssistant.name;
      result.surname = updatedAssistant.surname;
      result.email = updatedAssistant.email;
      result.eventId = updatedAssistant.eventId;
      result.username = updatedAssistant.username;

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



/* DELETE assistant by Id FUNCIONA*/
router.delete('/:id',
  passport.authenticate('bearer', { session: false }),
  async function(req, res, next) {
  const id = req.params.id;
  
  try {
    const result = await Assistant.findOneAndDelete({ _id: id });
    console.log(result);
    if (result) {
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

/*GET assistants by eventId FUNCIONA*/
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


/* DELETE assistant by name */
router.delete('/name/:name', async function(req, res, next) {
  const name = req.params.name;

  try {
    // Buscar el asistente en la base de datos por su nombre
    const result = await Assistant.findOne({ name });

    // Verificar si se encontró el asistente
    if (result) {
      // Eliminar el asistente de la base de datos
      await result.remove();
      // Enviar un código de estado 204 (Sin Contenido) como respuesta al cliente
      res.sendStatus(204);
    } else {
      // Enviar un código de estado 404 si el asistente no se encuentra
      res.sendStatus(404);
    }
  } catch (error) {
    // Manejar errores de manera adecuada
    console.error('Error al eliminar el asistente por nombre:', error);
    res.sendStatus(500);
  }
});


module.exports = router;

