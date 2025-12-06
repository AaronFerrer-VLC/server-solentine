/**
 * Script de Migración del Modelo Sale
 * 
 * Migra campos en español a inglés manteniendo compatibilidad hacia atrás
 * 
 * USO:
 * node scripts/migrate-sale-model.js
 * 
 * IMPORTANTE: Hacer backup de la base de datos antes de ejecutar
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Sale = require('../models/Sale.model');

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error('❌ MONGODB_URI no está configurada');
    process.exit(1);
}

/**
 * Migra un documento de Sale de campos en español a inglés
 */
function migrateSaleDocument(sale) {
    const updates = {};
    
    // Migrar campos si existen en español pero no en inglés
    if (sale.Día !== undefined && sale.day === undefined) {
        updates.day = sale.Día;
    }
    if (sale.Mes !== undefined && sale.month === undefined) {
        updates.month = sale.Mes;
    }
    if (sale.Año !== undefined && sale.year === undefined) {
        updates.year = sale.Año;
    }
    if (sale.Fecha !== undefined && sale.date === undefined) {
        updates.date = sale.Fecha;
    }
    if (sale.Negocio !== undefined && sale.business === undefined) {
        updates.business = sale.Negocio;
    }
    if (sale.Zona !== undefined && sale.zone === undefined) {
        updates.zone = sale.Zona;
    }
    if (sale.Marca !== undefined && sale.brand === undefined) {
        updates.brand = sale.Marca;
    }
    if (sale.Cliente !== undefined && sale.client === undefined) {
        updates.client = sale.Cliente;
    }
    if (sale.Importe !== undefined && sale.amount === undefined) {
        updates.amount = sale.Importe;
    }
    if (sale.Comercial !== undefined && sale.commercial === undefined) {
        updates.commercial = sale.Comercial;
    }
    if (sale.Id !== undefined && sale.saleId === undefined) {
        updates.saleId = sale.Id;
    }
    
    return Object.keys(updates).length > 0 ? updates : null;
}

/**
 * Ejecuta la migración
 */
async function runMigration() {
    try {
        console.log('🔄 Conectando a MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        console.log('📊 Contando documentos...');
        const totalSales = await Sale.countDocuments();
        console.log(`📦 Total de ventas: ${totalSales}`);

        console.log('🔄 Iniciando migración...');
        let migrated = 0;
        let skipped = 0;
        let errors = 0;

        const batchSize = 100;
        let processed = 0;

        while (processed < totalSales) {
            const sales = await Sale.find()
                .skip(processed)
                .limit(batchSize)
                .lean();

            for (const sale of sales) {
                try {
                    const updates = migrateSaleDocument(sale);
                    
                    if (updates) {
                        await Sale.updateOne(
                            { _id: sale._id },
                            { $set: updates }
                        );
                        migrated++;
                    } else {
                        skipped++;
                    }
                } catch (error) {
                    console.error(`❌ Error migrando venta ${sale._id}:`, error.message);
                    errors++;
                }
            }

            processed += sales.length;
            console.log(`📊 Progreso: ${processed}/${totalSales} (${Math.round(processed/totalSales*100)}%)`);
        }

        console.log('\n✅ Migración completada:');
        console.log(`   - Migradas: ${migrated}`);
        console.log(`   - Omitidas: ${skipped}`);
        console.log(`   - Errores: ${errors}`);

        await mongoose.connection.close();
        console.log('✅ Conexión cerrada');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error en la migración:', error);
        await mongoose.connection.close();
        process.exit(1);
    }
}

// Ejecutar migración
if (require.main === module) {
    runMigration();
}

module.exports = { migrateSaleDocument, runMigration };

