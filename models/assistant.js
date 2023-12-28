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
        required: true,
        unique:true
    },
    eventId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique:true
    },
    code: {
        type: String,
        required: true,
        unique:true
    }
});

assistantSchema.methods.cleanup = function() {
    return {
        name: this.name,
        surname: this.surname,
        email: this.email,
        eventId: this.eventId,
        username: this.username,
        code: this.code,
        _id: this._id
    }
}

const Assistant = mongoose.model('Assistant', assistantSchema);
module.exports = Assistant;
