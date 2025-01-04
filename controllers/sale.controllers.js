const axios = require('axios')

const mongoose = require('mongoose')
const Sale = require('../models/Sale.model')
const User = require('../models/User.model')


const getAllSales = (req, res, next) => {
    Sale
        .find()
        .sort({ createdAt: -1 })
        .then(sales => res.json(sales))
        .catch(err => next(err))
}

const getOneSale = (req, res, next) => {
    const { id: saleId } = req.params
    console.log("ID recibido en el servidor:", saleId)

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
        return res.status(404).json({ message: "Sale ID is not valid" });
    }

    Sale.findById(saleId)
    console.log("ID recibido en el servidor:", saleId)
        .then(sale => {
            if (!sale) return res.status(404).json({ message: "Sale not found" })
            res.json(sale)
        })
        .catch(err => next(err))
}

const saveSale = (req, res, next) => {
    const { Día, Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe, owner } = req.body

    Sale.create({ Día, Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe, owner })
        .then(sale => {
            if (owner) {
                return User.findByIdAndUpdate(
                    owner,
                    { $push: { sales: sale._id } },
                    { new: true, runValidators: true }
                ).then(() => sale)
            }
            return sale
        })
        .then(sale => res.status(201).json(sale))
        .catch(err => next(err))
};

const deleteSale = (req, res, next) => {
    const { id: saleId } = req.params

    if (!validateId(saleId, res)) return

    Sale.findById(saleId)
        .then(sale => {
            if (!sale) return res.status(404).json({ message: "Sale not found" })

            const { owner } = sale

            const promises = [Sale.findByIdAndDelete(saleId)]
            if (owner) {
                promises.push(
                    User.findByIdAndUpdate(
                        owner,
                        { $pull: { sales: saleId } },
                        { new: true, runValidators: true }
                    )
                )
            }

            return Promise.all(promises)
        })
        .then(() => res.sendStatus(200))
        .catch(err => next(err))
}

const editSale = (req, res, next) => {
    const { Día, Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe } = req.body
    const { id: saleId } = req.params;

    if (!validateId(saleId, res)) return

    Sale
        .findByIdAndUpdate(
            saleId,
            { Día, Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe },
            { new: true, runValidators: true }
        )
        .then(updatedSale => {
            if (!updatedSale) return res.status(404).json({ message: "Sale not found" })
            res.sendStatus(200)
        })
        .catch(err => next(err))
}

module.exports = {
    getAllSales,
    getOneSale,
    saveSale,
    deleteSale,
    editSale
}
