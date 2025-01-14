const Brand = require('../models/Brand.model');

const getAllBrands = async (req, res, next) => {
    try {
        const brands = await Brand.find();
        res.json(brands);
    } catch (err) {
        next(err);
    }
};

const createBrand = async (req, res, next) => {
    try {
        const newBrand = new Brand(req.body);
        const savedBrand = await newBrand.save();
        res.json(savedBrand);
    } catch (err) {
        next(err);
    }
};

const updateBrand = async (req, res, next) => {
    try {
        const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBrand);
    } catch (err) {
        next(err);
    }
};

const deleteBrand = async (req, res, next) => {
    try {
        await Brand.findByIdAndDelete(req.params.id);
        res.json({ message: 'Brand deleted' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllBrands,
    createBrand,
    updateBrand,
    deleteBrand
};