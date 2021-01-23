const mongoose = require("mongoose");

const scheduleShcema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    setSchedule: {
        type: Date,
        required: true
    },

    updated_at: {
        type: { type: Date, default: Date.now }
    },
    created_at: {
        type: { type: Date, default: Date.now }
    }
})

const Schedule = new mongoose.model("Schedule", scheduleShcema);

module.exports = Schedule;
