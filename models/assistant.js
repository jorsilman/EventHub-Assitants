const mongoose = require('mongoose');

const assistantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eventId: {
        type: String,
        required: true
    }
});

assistantSchema.methods.cleanup = function() {
    return {
        name: this.name,
        surname: this.surname,
        email: this.email,
        eventId: this.eventId
    }
}

const Assistant = mongoose.model('Assistant', assistantSchema);
module.exports = Assistant;
