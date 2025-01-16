const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zoneSchema = new Schema({
    name: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    position: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    sales: [{ type: Schema.Types.ObjectId, ref: 'Sale' }]
}, { timestamps: true });

module.exports = mongoose.model('Zone', zoneSchema);