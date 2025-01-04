const { Schema, model } = require("mongoose")

const saleSchema = new Schema(
    {
        Día: {
            type: Number,
            required: [true, 'Escribe el día']
        },

        Mes: {
            type: Number,
            required: [true, 'Escribe el mes']
        },
        MImp: {
            type: Number,
            required: [true, 'Escribe el MImp']
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
            type: String,
            required: [true, 'Selecciona un cliente'],
            validate: {
                validator: Zona => Zona.length >= 1,
                message: 'Selecciona un cliente'
            }
        },
        Marca: {
            type: String,
            required: [true, 'Introduce una marca']

        },
        Cliente: {
            type: String,
            required: [true, 'Selecciona un cliente'],
            validate: {
                validator: Cliente => Cliente.length >= 1,
                message: 'Selecciona un cliente'
            }
        },
        Importe: {
            type: Number,
            required: [true, 'introduce el importe'],
        }
    }
)

const Sale = model("Sale", saleSchema)

module.exports = Sale