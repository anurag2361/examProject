var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var questionSchema = new Schema({
    question: { type: String, require: true },
    optionA: { type: String, require: true },
    optionB: { type: String, require: true },
    optionC: { type: String, require: true },
    optionD: { type: String, require: true },
    answer: { type: String, require: true }
});

module.exports = mongoose.model('Question', questionSchema);
