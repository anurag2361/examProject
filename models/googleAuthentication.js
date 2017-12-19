var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var googleauthenticationSchema = new Schema({
    id: { type: String },
    name: { type: String, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model('googleAuthentication', googleauthenticationSchema);
