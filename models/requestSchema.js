var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var volunteerMapSchema = new Schema({
    unique_id: Number,
    volunteer_id: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    location: String,
    description: String,
    cords: {
        latitude: Number,
        longitude: Number
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Completed'],
        default: 'Open'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

var VolunteerMap = mongoose.model('VolunteerMap', volunteerMapSchema);

module.exports = VolunteerMap;