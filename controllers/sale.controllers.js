const axios = require('axios')
const mongoose = require('mongoose')
const User = require('../models/User.model')
const Sale = require('../models/Sale.model')
const { response } = require('express')

const getAllSales = (req, res, next) => {
    Sale
        .find()
        .then(response => {
            const unOrderedSales = response
            const orderedSales = unOrderedSales.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            res.json(orderedSales)
        })
        .catch(err => next(err))
}

const getOneSale = (req, res, next) => {

    const { id: saleId } = req.params

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
        res.status(404).json({ message: "Id format not valid" });
        return
    }

    Sale
        .findById(saleId)
        .then(sale => res.json(sale))
        .catch(err => next(err))
}

const saveSale = (req, res, next) => {

    const { Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe } = req.body

    Sale
        .create({ Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe })
        .then(sale => {
            res.status(201).json(sale)
            return (sale._id)
        })
        .then(saleId => {

            User
                .findByIdAndUpdate(
                    owner,
                    { $push: { sales: saleId } },
                    { new: true, runValidators: true }
                )
                .then()
                .catch(err => next(err))

        })
        .catch(err => next(err))
}

const deleteSale = (req, res, next) => {

    const { id: saleId } = req.params

    if (!mongoose.Types.ObjectId.isValid(communityId)) {
        res.status(404).json({ message: "Id format not valid" });
        return
    }


    Sale
        .findById(saleId)
        .then(sale => { return sale })
        .then(sale => {
            console.log(sale)
            const { owner } = sale

            User
                .findByIdAndUpdate(
                    owner,
                    { $pull: { sales: saleId } },
                    { new: true, runValidators: true }
                )
                .then()
                .catch(err => next(err))

        })
        .catch(err => next(err))

    Sale
        .findByIdAndDelete(saleId)
        .then(() => res.sendStatus(200))
        .catch(err => next(err))

}

const editSale = (req, res, next) => {

    const { Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe } = req.body
    const { id: saleId } = req.params

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
        res.status(404).json({ message: "Id format not valid" });
        return
    }

    Sale
        .findByIdAndUpdate(
            saleId,
            { Mes, MImp, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe },
            { runValidators: true }
        )
        .then(() => res.sendStatus(200))
        .catch(err => next(err))
}

module.exports = {
    getAllSales,
    getOneSale,
    saveSale,
    deleteSale,
    editSale
}