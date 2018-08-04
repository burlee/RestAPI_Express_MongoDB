const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname); 
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 8
    },
    fileFilter: fileFilter
  });


const Product = require('../model/product');


router.get('/', (req, res, next ) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then( docs => {
            const response = {
                count: docs.length,
                products: docs.map( doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: doc.productImage
                        // request:{
                        //     type: "GET",
                        //     url: `http://localhost:3000/products/${doc._id}`
                        // }
                    }
                })
            }
            res.status(200).json(response)
        })
        .catch(error => {
            res.status(500).json({
                error: "Produktu nie znaleziono"
            })
        })
});

router.post('/', upload.single('productImage') ,( req, res, next ) => {
    // console.log( req.file) <-- Information about image I can see here
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    })
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    product
        .save()
        .then( addedProduct =>{
            res.status(201).json({
                message: `Produkt ${product.name} został dodany pomyślnie`,
                createdProduct: {
                    name: addedProduct.name,
                    price: addedProduct.price,
                    _id: addedProduct._id
                }
            });
        })
        .catch( error => {
                res.status(500).json({
                    error: error,
                    status: 500
                });
            }
        );
 
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then( doc => {
            if(doc){
                console.log(doc)
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        description: 'FETCH_ALL_PRODUCTS',
                        url: 'http://localhost:3000/products/'
                    }
                })
            }else{
                res.status(404).json({
                    message: "Nie znaleziono:("
                })
            }
        })
        .catch( error => {
            console.log(error)
            res.status(500).json({
                message: "Product dont't find"
            })
        })
    // res.status(200).json({
    //     message: `You handling ${id}`
    // })
});

router.post('/:id', (req, res, next) => {
    const id = req.params.id;
    res.status(200).json({
        message: `You handling ${id}`
    })
});

router.patch('/:id', (req, res, next) => {
    const id = req.params.id;
    // const updateOps = {};
    // for(const ops in req.body ){
    //     updateOps[ops.propName] = ops.value
    // }
    const updateOps = {}
    for (const key of Object.keys(req.body)) {
        updateOps[key] = req.body[key]
    }
    Product.update( {_id:id} , { $set: req.body} )
        .exec()
        .then( result => {
            console.log(result)
            res.status(200).json({
                message: `You update product ${id}`,
                request: {
                    type: 'More information below',
                    url: `http://localhost:3000/products/${id}`
                }
            })
        })
        .catch( error => {
            console.log( error )
            res.status(500).json({
                error: error
            })
        })
    
});

router.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.remove({_id: id})
        .exec()
        .then( result => {
            console.log( result )
            res.status(200).json({
                message: `Usunieto produkt o ${id}`
            })
        })
        .catch( error => {
            console.log( error )
            res.status(500).json({
                message: "nie udalo sie usunac produktu"
            })
        })
    // Product.findByIdAndRemove(id)
    //     .exec()
    //     .then( res => {
    //         console.log( res )
    //         res.status(200).json({
    //             message: res
    //         })
    //     })
    //     .catch( error => {
    //         res.status(500).json({
    //             message: "Nie udalo sie usunac produktu"
    //         })
    //     })
    // res.status(200).json({
    //     message: `You delete product with ${id}`
    // })
});

module.exports = router;
