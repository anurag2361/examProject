var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userauthenticationSchema = new Schema({
    id: { type: String },
    name: { type: String, required: true }
})

module.exports = mongoose.model('userAuthentication', userauthenticationSchema);
