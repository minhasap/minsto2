
const offerSchema = require('../models/offerModel');
const productOfferSchema = require('../models/productoffer_Model');
const categorySchema = require('../models/categoryModel');
const productSchema = require('../models/productModels');


const offer_managemnet = async (req, res) => {
    try {
        // const categoryId = req.query.id;

        const offers = await offerSchema.find().populate('category')


        return res.render('offer_management', { offers });

    } catch (error) {
        console.log(error);
    }
}

const add = async (req, res) => {
    try {
        const categories = await categorySchema.find({ status: false });

        return res.render('add_offer', { categories: categories });
    } catch (error) {
        console.log(error.message);
    }
}

const get_Data = async (req, res) => {
    try {
        const data = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        };


        if (!data.title || !data.description || !data.category || !data.discountPercentage || !data.startDate || !data.endDate) {
            return res.json({ error: 'Fill in all fields!' });
        }

        const newOffer = await offerSchema(data);
        await newOffer.save();
        console.log(newOffer);
        res.json({ newOffer })

    } catch (error) {
        console.log(error);
    }
}

const edit = async (req, res) => {
    try {
        const offerId = req.params.id;
        const data = await offerSchema.findOne({ _id: offerId })
            .populate('category');

        const categories = await categorySchema.find({ status: false });

        res.render('edit', { data, categories });
    } catch (error) {
        console.log(error);
    }
}

const update = async (req, res) => {
    try {
        const offerId = req.body.id;
        const data = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        };
        if (!data.title || !data.description || !data.category || !data.discountPercentage || !data.startDate || !data.endDate) {
            return res.json({ error: 'Fill in all fields!' });
        }
        let result = await offerSchema.updateOne({ _id: offerId }, data);
        console.log(result)
        return res.json({ success: 'success' })

    } catch (error) {
        console.log(error);
    }
}



/// product offer ...................
const productOffer_management = async (req, res) => {
    try {
        const productOffers = await productSchema.find();
        return res.render('productOffer_management', { productOffers });
    } catch (error) {
        console.log(error);
    }
}

const add_product_offer = async (req, res) => {
    try {
        const products = await productSchema.find({ status: false });
        return res.render('add_product_offer', { products });
    } catch (error) {
        console.log(error);
    }
}

const get_product_offer = async (req, res) => {
    try {
        const data = {
            product_name: req.body.product_name,
            description: req.body.description,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        };
        
        if (!data.product_name || !data.description || !data.discountPercentage || !data.startDate || !data.endDate) {
            return res.json({ error: 'Fill in all fields!' });
        }
        const newOffer = await productOfferSchema.create(data);
        console.log(newOffer);
        res.json({ newOffer })
    } catch (error) {
        console.log(error);
    }
}

const edit_product_offer = async (req, res) => {
    try {
        const offerId = req.params.id;
        const data = await productOfferSchema.findOne({ _id: offerId })
            .populate('product_name');
        const products = await productSchema.find({ status: false });

        return res.render('edit_product_offer', { data, products })
    } catch (error) {
        console.log(error);
    }
}

const update_product_offer = async (req, res) => {
    try {
        const offerId = req.body.id;
        const data = {
            product_name: req.body.product_name,
            description: req.body.description,
            discountPercentage: req.body.discountPercentage,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        };
        if (!data.product_name || !data.description || !data.discountPercentage || !data.startDate || !data.endDate) {
            return res.json({ error: 'Fill in all fields!' });
        }
        let result = await productOfferSchema.updateOne({ _id: offerId }, data);
        console.log(result)
        return res.json({ success: 'success' })

    } catch (error) {
        console.log(error);
    }
}
module.exports = {
    offer_managemnet,
    add,
    get_Data,
    edit,
    update,
    productOffer_management,
    add_product_offer,
    get_product_offer,
    edit_product_offer,
    update_product_offer,
}