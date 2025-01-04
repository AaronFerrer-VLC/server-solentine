const {
    deleteSale,
    getAllSales,
    getOneSale,
    saveSale,
    editSale

} = require("../controllers/sale.controllers")

const verifyToken = require("../middlewares/verifyToken")

const router = require("express").Router()

router.get('/sales/search/:querySearch', async (req, res, next) => {
    const { querySearch } = req.params

    try {
        const response = await filterSales(querySearch)
        console.log(response)
        res.json(response)
    }
    catch (error) {
        next(error)
    }
})

router.post('/sales', saveSale)
router.put('/sales/:id', editSale)
router.get('/sales/', getAllSales)
router.get('/sales/:id', getOneSale)
router.delete('/sales/:id', deleteSale)

module.exports = router