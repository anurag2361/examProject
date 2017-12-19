var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var performanceSchema = new Schema({
    user: { type: String, required: true },
    test: [],
    score: { type: Number, default: 0 },
    timeTaken: { type: Number, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalIncorrect: { type: Number, default: 0 }
});

module.exports = mongoose.model('Performance', performanceSchema);
