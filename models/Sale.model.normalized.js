/**
 * Sale Model - Normalized Version
 * 
 * This is the normalized version with English field names.
 * The original model uses Spanish field names which should be migrated.
 * 
 * Migration plan:
 * 1. Add both field names (old and new) with aliases
 * 2. Update controllers to use new names
 * 3. Create migration script
 * 4. Update frontend
 * 5. Remove old field names
 */

const { Schema, model } = require("mongoose");

const saleSchema = new Schema(
    {
        // Legacy fields (Spanish) - to be removed after migration
        Id: {
            type: Number,
            required: [true, 'Sale ID is required'],
            alias: 'saleId'
        },
        Día: {
            type: Number,
            required: [true, 'Day is required'],
            alias: 'day'
        },
        Mes: {
            type: Number,
            required: [true, 'Month is required'],
            alias: 'month'
        },
        Año: {
            type: Number,
            required: [true, 'Year is required'],
            alias: 'year'
        },
        Fecha: {
            type: String,
            required: [true, 'Date is required'],
            alias: 'date'
        },
        Negocio: {
            type: String,
            required: [true, 'Business is required'],
            validate: {
                validator: (business) => business.length >= 1,
                message: 'Business must be at least 1 character'
            },
            alias: 'business'
        },
        Zona: {
            type: Schema.Types.ObjectId,
            ref: 'Zone',
            alias: 'zone'
        },
        Marca: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
            alias: 'brand'
        },
        Cliente: {
            type: Schema.Types.ObjectId,
            ref: 'Client',
            alias: 'client'
        },
        Importe: {
            type: Number,
            required: [true, 'Amount is required'],
            min: [0, 'Amount must be positive'],
            alias: 'amount'
        },
        Comercial: {
            type: Schema.Types.ObjectId,
            ref: 'Comercial',
            alias: 'commercial'
        },
        
        // Normalized fields (English) - preferred going forward
        saleId: {
            type: Number,
            required: false, // Will be required after migration
            unique: false
        },
        day: {
            type: Number,
            required: false,
            min: 1,
            max: 31
        },
        month: {
            type: Number,
            required: false,
            min: 1,
            max: 12
        },
        year: {
            type: Number,
            required: false,
            min: 2000,
            max: 2100
        },
        date: {
            type: String,
            required: false,
            match: [/^\d{2}\/\d{2}\/\d{4}$/, 'Date must be in DD/MM/YYYY format']
        },
        business: {
            type: String,
            required: false,
            trim: true,
            maxlength: [100, 'Business name is too long']
        },
        zone: {
            type: Schema.Types.ObjectId,
            ref: 'Zone'
        },
        brand: {
            type: Schema.Types.ObjectId,
            ref: 'Brand'
        },
        client: {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        },
        amount: {
            type: Number,
            required: false,
            min: [0, 'Amount must be positive']
        },
        commercial: {
            type: Schema.Types.ObjectId,
            ref: 'Comercial'
        },
        
        // Common fields (already in English)
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        deletedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
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
                
                // Remove legacy fields from output (optional - can keep for backward compatibility)
                // delete ret.Día;
                // delete ret.Mes;
                // delete ret.Año;
                // delete ret.Fecha;
                // delete ret.Negocio;
                // delete ret.Zona;
                // delete ret.Marca;
                // delete ret.Cliente;
                // delete ret.Importe;
                // delete ret.Comercial;
                // delete ret.Id;
                
                delete ret.__v;
                return ret;
            }
        }
    }
);

// Indexes for better query performance
saleSchema.index({ year: 1, month: 1 });
saleSchema.index({ business: 1 });
saleSchema.index({ date: 1 });
saleSchema.index({ createdBy: 1 });
saleSchema.index({ zone: 1 });
saleSchema.index({ brand: 1 });
saleSchema.index({ client: 1 });
saleSchema.index({ commercial: 1 });

// Compound indexes for common queries
saleSchema.index({ year: 1, business: 1 });
saleSchema.index({ zone: 1, year: 1 });

const Sale = model("Sale", saleSchema);

module.exports = Sale;

