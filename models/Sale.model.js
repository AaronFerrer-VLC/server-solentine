/**
 * @fileoverview Sale Model - Normalized version with backward compatibility
 * @module models/Sale
 */

const { Schema, model } = require("mongoose")

const saleSchema = new Schema(
    {
        // Legacy fields (Spanish) - maintained for backward compatibility
        // Will be deprecated after migration
        /** @type {Number} Legacy sale ID */
        Id: {
            type: Number,
            required: [true, 'Sale ID is required'],
            alias: 'saleId'
        },
        /** @type {Number} Legacy day (1-31) */
        Día: {
            type: Number,
            required: [true, 'Day is required'],
            min: 1,
            max: 31,
            alias: 'day'
        },
        /** @type {Number} Legacy month (1-12) */
        Mes: {
            type: Number,
            required: [true, 'Month is required'],
            min: 1,
            max: 12,
            alias: 'month'
        },
        /** @type {Number} Legacy year */
        Año: {
            type: Number,
            required: [true, 'Year is required'],
            min: 2000,
            max: 2100,
            alias: 'year'
        },
        /** @type {String} Legacy date string (DD/MM/YYYY) */
        Fecha: {
            type: String,
            required: [true, 'Date is required'],
            match: [/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format'],
            alias: 'date'
        },
        /** @type {String} Legacy business name */
        Negocio: {
            type: String,
            required: [true, 'Business is required'],
            trim: true,
            maxlength: [100, 'Business name is too long'],
            validate: {
                validator: Negocio => Negocio.length >= 1,
                message: 'Business must be at least 1 character'
            },
            alias: 'business'
        },
        /** @type {Schema.Types.ObjectId} Legacy zone reference */
        Zona: {
            type: Schema.Types.ObjectId,
            ref: 'Zone',
            alias: 'zone'
        },
        /** @type {Schema.Types.ObjectId} Legacy brand reference */
        Marca: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
            alias: 'brand'
        },
        /** @type {Schema.Types.ObjectId} Legacy client reference */
        Cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            alias: 'client'
        },
        /** @type {Number} Legacy amount */
        Importe: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
            alias: 'amount'
        },
        /** @type {Schema.Types.ObjectId} Legacy commercial reference */
        Comercial: {
            type: Schema.Types.ObjectId,
            ref: 'Comercial',
            alias: 'commercial'
        },
        
        // Normalized fields (English) - preferred going forward
        /** @type {Number} Sale ID */
        saleId: {
            type: Number,
            required: false, // Will be required after migration
        },
        /** @type {Number} Day of month (1-31) */
        day: {
            type: Number,
            required: false,
            min: 1,
            max: 31
        },
        /** @type {Number} Month (1-12) */
        month: {
            type: Number,
            required: false,
            min: 1,
            max: 12
        },
        /** @type {Number} Year */
        year: {
            type: Number,
            required: false,
            min: 2000,
            max: 2100
        },
        /** @type {String} Date string (DD/MM/YYYY) */
        date: {
            type: String,
            required: false,
            match: [/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format']
        },
        /** @type {String} Business name */
        business: {
            type: String,
            required: false,
            trim: true,
            maxlength: [100, 'Business name is too long']
        },
        /** @type {Schema.Types.ObjectId} Zone reference */
        zone: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        },
        /** @type {Schema.Types.ObjectId} Brand reference */
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand'
        },
        /** @type {Schema.Types.ObjectId} Client reference */
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        },
        /** @type {Number} Sale amount */
        amount: {
            type: Number,
            required: false,
            min: [0, 'Amount must be positive']
        },
        /** @type {Schema.Types.ObjectId} Commercial reference */
        commercial: {
            type: Schema.Types.ObjectId,
            ref: 'Comercial'
        },
        /** @type {Schema.Types.ObjectId} User who created the sale */
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        /** @type {Schema.Types.ObjectId} User who last updated the sale */
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        /** @type {Schema.Types.ObjectId} User who deleted the sale */
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        /** @type {Schema.Types.ObjectId} Legacy user reference */
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: function(doc, ret) {
                // Transform legacy fields to normalized names in JSON output
                if (ret.Día !== undefined) ret.day = ret.Día;
                if (ret.Mes !== undefined) ret.month = ret.Mes;
                if (ret.Año !== undefined) ret.year = ret.Año;
                if (ret.Fecha !== undefined) ret.date = ret.Fecha;
                if (ret.Negocio !== undefined) ret.business = ret.Negocio;
                if (ret.Zona !== undefined) ret.zone = ret.Zona;
                if (ret.Marca !== undefined) ret.brand = ret.Marca;
                if (ret.Cliente !== undefined) ret.client = ret.Cliente;
                if (ret.Importe !== undefined) ret.amount = ret.Importe;
                if (ret.Comercial !== undefined) ret.commercial = ret.Comercial;
                if (ret.Id !== undefined) ret.saleId = ret.Id;
                
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Indexes for better query performance
saleSchema.index({ year: 1, month: 1 });
saleSchema.index({ Año: 1, Mes: 1 }); // Legacy index
saleSchema.index({ business: 1 });
saleSchema.index({ Negocio: 1 }); // Legacy index
saleSchema.index({ date: 1 });
saleSchema.index({ Fecha: 1 }); // Legacy index
saleSchema.index({ createdBy: 1 });
saleSchema.index({ zone: 1 });
saleSchema.index({ Zona: 1 }); // Legacy index
saleSchema.index({ brand: 1 });
saleSchema.index({ Marca: 1 }); // Legacy index
saleSchema.index({ client: 1 });
saleSchema.index({ Cliente: 1 }); // Legacy index
saleSchema.index({ commercial: 1 });
saleSchema.index({ Comercial: 1 }); // Legacy index

// Compound indexes for common queries
saleSchema.index({ year: 1, business: 1 });
saleSchema.index({ Año: 1, Negocio: 1 }); // Legacy index
saleSchema.index({ zone: 1, year: 1 });
saleSchema.index({ Zona: 1, Año: 1 }); // Legacy index

/**
 * Sale Model
 * @class Sale
 */
const Sale = model("Sale", saleSchema)

module.exports = Sale