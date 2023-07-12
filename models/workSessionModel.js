const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const workSessionSchema = new Schema({
    user_id: {
        type: String,
        required: true
    },
    clockIn: {  // in format of HH:MM:SS
        type: String,
        required: true
    },
    yearMonth: {     // in format of YYYY-MM
        type: String,
        required: true
    },
    day: {          // in format of DD
        type: String,
        required: true
    },
    clockOut: { // in format of HH:MM:SS
        type: String
    },
    duration: { // should be calculated in browser, format of HH:MM:SS
        type: String
    },
    user_note: {
        type: String
    },
    working_from: {
        type: String
    }
});

module.exports = mongoose.model('WorkSession', workSessionSchema);
// we created module that we import where we need
// we use the import to interact with the 'Users' collection that
// is generated automatically