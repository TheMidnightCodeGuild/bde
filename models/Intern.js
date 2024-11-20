const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    mobile: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    referalCode: {
        type: String,
        unique: true
    },
    comissionEarned: {
        type: Number,
        default: 0
    },
    comissionReleased: {
        type: Number,
        default: 0
    },
    TeamName: {
        type: String,
        required: true
    },
    DataAssigned: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
    calls: [{
        Date: {
            type: Date,
            required: true
        },
        NoOfClients: {
            type: Number,
            required: true
        },
        MeetingsScheduled: {
            type: Number,
            required: true
        }
    }],
    dealsClosedPersonally: {
        type: Number,
        default: 0
    },
    dealsClosedByTeam: {
        type: Number,
        default: 0
    },
    teamLeader: {
        type: String,
        required: true
    }
});

// Check if model exists before creating
module.exports = mongoose.models.Intern || mongoose.model('Intern', internSchema);
