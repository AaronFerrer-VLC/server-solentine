const Comercial = require('../models/Comercial.model');

const getAllComercials = async (req, res, next) => {
    try {
        const comercials = await Comercial.find();
        res.json(comercials);
    } catch (err) {
        next(err);
    }
};

const createComercial = async (req, res, next) => {
    try {
        const newComercial = new Comercial(req.body);
        const savedComercial = await newComercial.save();
        res.json(savedComercial);
    } catch (err) {
        next(err);
    }
};

const updateComercial = async (req, res, next) => {
    try {
        const updatedComercial = await Comercial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedComercial);
    } catch (err) {
        next(err);
    }
};

const deleteComercial = async (req, res, next) => {
    try {
        await Comercial.findByIdAndDelete(req.params.id);
        res.json({ message: 'Comercial deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllComercials,
    createComercial,
    updateComercial,
    deleteComercial
};