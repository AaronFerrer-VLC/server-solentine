const axios = require('axios')
const mongoose = require('mongoose')
const Sale = require('../models/Sale.model')
const User = require('../models/User.model')


const getAllSales = async (req, res, next) => {
    const { page = 1, limit = 100, sortKey = 'Fecha', sortDirection = 'asc', ...filters } = req.query;

    const skip = (page - 1) * limit;
    console.log(`Página: ${page}, Limit: ${limit}, Skip: ${skip}`);

    try {
        const { query, sort } = buildQuery(filters, sortKey, sortDirection);

        console.log('Filtros:', filters);
        console.log('Consulta generada:', query);

        const totalSales = await Sale.countDocuments(query);

        if (skip >= totalSales) {
            return res.json({ sales: [], totalSales, totalPages: Math.ceil(totalSales / limit) });
        }

        const sales = await Sale.find(query)
            .populate('Zona')
            .populate('Marca')
            .populate('Cliente')
            .populate('Comercial')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit));

        console.log('Resultados devueltos:', sales.length);

        const totalPages = Math.ceil(totalSales / limit);

        res.json({ sales, totalSales, totalPages });
    } catch (err) {
        next(err);
    }
}


const getAllSalesForHomePage = async (req, res, next) => {
    try {
        const sales = await Sale.find()
            .populate('Zona')
            .populate('Marca')
            .populate('Cliente')
            .populate('Comercial');
        res.json({ sales });
    } catch (err) {
        next(err);
    }
};


const getOneSale = (req, res, next) => {
    const { id: saleId } = req.params;
    console.log("ID recibido en el servidor:", saleId)

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
        return res.status(404).json({ message: "Sale ID is not valid" })
    }

    Sale.findById(saleId)
        .then(sale => {
            if (!sale) return res.status(404).json({ message: "Sale not found" })
            res.json(sale)
        })
        .catch(err => next(err))
}


const saveSale = (req, res, next) => {
    const { Id, Día, Mes, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe, Comercial } = req.body

    const storedToken = req.headers.authorization.split(" ")[1]
    const userId = storedToken ? JSON.parse(atob(storedToken.split('.')[1])).userId : null

    if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" })
    }

    Sale.create({
        Id,
        Día,
        Mes,
        Año,
        Fecha,
        Negocio,
        Zona,
        Marca,
        Cliente,
        Importe,
        Comercial,
        createdBy: userId,
    })
        .then(sale => {
            if (userId) {
                return User.findByIdAndUpdate(
                    userId,
                    { $push: { sales: sale._id } },
                    { new: true, runValidators: true }
                ).then(() => sale);
            }
            return sale;
        })
        .then(sale => res.status(201).json(sale))
        .catch(err => next(err))
}


const deleteSale = (req, res, next) => {
    const { id: saleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(saleId)) {
        res.status(404).json({ message: "Id format not valid" });
        return;
    }

    Sale.findByIdAndDelete(saleId)
        .then(sale => {
            if (!sale) {
                return res.status(404).json({ message: "Sale not found" });
            }
            const { owner } = sale
            User.findByIdAndUpdate(
                owner,
                { $pull: { sales: saleId } },
                { new: true, runValidators: true }
            )
                .then(() => res.sendStatus(200))
                .catch(err => next(err))
        })
        .catch(err => next(err))
}


const editSale = (req, res, next) => {
    const { Id, Día, Mes, Año, Fecha, Negocio, Zona, Marca, Cliente, Importe, Comercial } = req.body
    const { id: saleId } = req.params;

    const storedToken = req.headers.authorization.split(" ")[1];
    const userId = storedToken ? JSON.parse(atob(storedToken.split('.')[1])).userId : null

    if (!userId) {
        return res.status(401).json({ message: "Usuario no autenticado" })
    }

    Sale.findByIdAndUpdate(
        saleId,
        {
            Id,
            Día,
            Mes,
            Año,
            Fecha,
            Negocio,
            Zona,
            Marca,
            Cliente,
            Importe,
            Comercial,
            updatedBy: userId,
        },
        { new: true, runValidators: true }
    )
        .then(updatedSale => {
            if (!updatedSale) return res.status(404).json({ message: "Venta no encontrada" })
            res.status(200).json(updatedSale)
        })
        .catch(err => next(err))
}

const buildQuery = (filters, sortKey, sortDirection) => {
    let query = {};
    let sort = {};

    if (filters.id) {
        const idNumber = Number(filters.id);
        if (!isNaN(idNumber)) query.Id = idNumber;
    }

    if (filters.year) query.Año = filters.year;
    if (filters.business) query.Negocio = filters.business;
    if (filters.zone) query.Zona = mongoose.Types.ObjectId.isValid(filters.zone) ? filters.zone : null;
    if (filters.brand) query.Marca = mongoose.Types.ObjectId.isValid(filters.brand) ? filters.brand : null;
    if (filters.client) query.Cliente = mongoose.Types.ObjectId.isValid(filters.client) ? filters.client : null;
    if (filters.comercial) query.Comercial = mongoose.Types.ObjectId.isValid(filters.comercial) ? filters.comercial : null;

    if (sortKey && sortDirection) {
        sort[sortKey] = sortDirection === 'asc' ? 1 : -1;
    }

    console.log('Consulta final generada:', { query, sort });

    return { query, sort };
};


const filterSales = async (filters) => {
    const page = filters.page ? parseInt(filters.page, 10) : 1
    const limit = filters.limit ? parseInt(filters.limit, 10) : 100
    const skip = (page - 1) * limit

    console.log(`Página: ${page}, Limit: ${limit}, Skip: ${skip}`)

    console.log("Filtros recibidos:", filters)

    const { sortBy, dateBy, idBy, ...filtersRest } = filters
    const { query, sort } = buildQuery(filtersRest, sortBy, dateBy, idBy)

    console.log("Consulta generada:", query)
    console.log("Ordenación generada:", sort)

    try {
        const totalSales = await Sale.countDocuments(query);
        const sales = await Sale.find(query)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))

        const totalPages = Math.ceil(totalSales / limit)

        return { sales, totalSales, totalPages }
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAllSales,
    getOneSale,
    saveSale,
    deleteSale,
    editSale,
    filterSales,
    getAllSalesForHomePage,
};