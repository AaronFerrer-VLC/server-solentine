const { Schema, model } = require("mongoose")

const saleSchema = new Schema(
    {
        Id: {
            type: Number,
            required: [true, 'Escribe el Id']
        },
        Día: {
            type: Number,
            required: [true, 'Escribe el día']
        },

        Mes: {
            type: Number,
            required: [true, 'Escribe el mes']
        },
        Año: {
            type: Number,
            required: [true, 'Escribe el Año']
        },
        Fecha: {
            type: String,
            required: [true, 'Selecciona la fecha']
        },
        Negocio: {
            type: String,
            required: [true, 'Selecciona un Negocio'],
            validate: {
                validator: Negocio => Negocio.length >= 1,
                message: 'Selecciona un Negocio'
            }
        },
        Zona: {
            type: Schema.Types.ObjectId,
            ref: 'Zone',
            // required: true
        },
        Marca: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
            // required: true
        },
        Cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            // required: true
        },
        Importe: {
            type: Number,
            required: [true, 'introduce el importe'],
        },
        Comercial: {
            type: Schema.Types.ObjectId,
            ref: 'Comercial',
            // required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }
)

const Sale = model("Sale", saleSchema)

module.exports = Sale