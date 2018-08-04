const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../model/orders')

router.get('/', (req, res, next) => {
    Order.find()
    .select('product quantity _id')
    .exec()
    .then( docs => {
        res.status(200).json({
            ilosc: docs.length,
            orders: docs.map( doc => {
                return{
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${doc._id}`
                    }

                }
            })
        })
    })
    .catch(error => {
        res.status(500).json({
            error
        })
    })
    // res.status(200).json({
    //     message: 'You receive product'
    // })
});

router.post('/', (req, res, next) => {
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    })
    order
    .save()
    .then( result => {
        res.status(201).json({
            message: 'Order STORED!',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            }
        })
    })
    .catch( error => {
        res.status(500).json({
            message: "Produkt nie istnieje"
        })
    })
    // const order = {
    //     orderId: req.body.orderId,
    //     quantity: req.body.quantity
    // }
    // res.status(201).json({
    //     message: 'orders was created',
    //     order: order
    // })
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Order.findById(id)
        .exec()
        .then(order => {
            if(!order){
                res.status(404).json({
                    message: "Nie znaleziono"
                })
            }
            res.status(200).json({
                order: order
            })
        })
        .catch( error => {
            res.status(404).json({
                message: "Nie znaleziono zamowienia"
            })
        })
    // res.status(200).json({
    //     message: `Details about product ${id}`
    // })
});

router.delete('/:id', (req, res, next) => {
    Order.findByIdAndRemove(req.params.id)
        .exec()
        .then( orderDeleted => {
            res.status(200).json({
                message: "Produkt zostal usunięty! :-)"
            })
        })
        .catch( error => {
            res.status(500).json({
                message: error
            })
        })
    // res.status(200).json({
    //     message: 'order Deleted'
    // })
});

module.exports = router;
