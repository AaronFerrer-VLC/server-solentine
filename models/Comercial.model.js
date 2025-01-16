const mongoose = require('mongoose')
const Schema = mongoose.Schema

const comercialSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }]
}, { timestamps: true })

module.exports = mongoose.model('Comercial', comercialSchema)