const {
    deleteSale,
    getAllSales,
    getOneSale,
    saveSale,
    editSale,
    filterSales,
    getAllSalesForHomePage,
    getAllSalesWithoutPagination // Import the new function
} = require('../controllers/sale.controllers')

const verifyToken = require("../middlewares/verifyToken")

const router = require("express").Router()


router.get('/sales/search', async (req, res, next) => {
    const { id, year, business, zone, brand, client, comercial, sortBy, dateBy, idBy, page, limit } = req.query;

    try {
        const response = await filterSales({ id, year, business, zone, brand, client, comercial, sortBy, dateBy, idBy }, page, limit);
        res.json(response);
    } catch (error) {
        next(error);
    }
})

router.post('/sales', verifyToken, saveSale);

// Ruta para editar una venta (requiere autenticación)
router.put('/sales/:id', verifyToken, editSale);

// Ruta para obtener todas las ventas
router.get('/sales', getAllSales);

// Ruta para obtener todas las ventas para la página de inicio
router.get('/sales/all', getAllSalesForHomePage)

// Ruta para obtener todas las ventas sin paginación
router.get('/sales/all-without-pagination', getAllSalesWithoutPagination);

// Ruta para obtener una venta por ID
router.get('/sales/:id', getOneSale);

// Ruta para eliminar una venta (requiere autenticación)
router.delete('/sales/:id', verifyToken, deleteSale);

router.get('/all', getAllSalesForHomePage);

module.exports = router;