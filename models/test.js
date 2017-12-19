var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var testSchema = new Schema({
    testName: { type: String, required: true },
    testCategory: { type: String, required: true },
    totalScore: { type: Number, default: 100, required: true },
    totalQuestion: { type: Number, default: 10 },
    testDetails: { type: String },
    testgivenBy: [],
    testDuration: { type: Number, default: 30 },
    questions: []
});

module.exports = mongoose.model('Test', testSchema);
