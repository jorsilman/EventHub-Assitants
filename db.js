const mongoose = require('mongoose');
const DB_URL = (process.env.DB_URL ||"mongodb+srv://trabajoFIS:FIS2324@assistants-service.gonxlob.mongodb.net/");

mongoose.connect(DB_URL);
const db = mongoose.connection;

// recover from errors
db.on('error', console.error.bind(console, 'db connection error'));

module.exports = db;