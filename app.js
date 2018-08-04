const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const confiDataBase = require('./ConfigMongoDB/ConfigMongoDB')


const productRoutes = require('./api/routes/products.js');
const orderDetails = require('./api/routes/orders');


mongoose.connect(confiDataBase.module.configDB, { useNewUrlParser: true })
.then( () => console.log('Success access'))
.catch( error => console.log(error))


app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.use('/products', productRoutes); 
app.use('/orders', orderDetails);


app.use((req, res, next) => {
    const error = new Error("Not found")
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message + ' ' + error.status
        }
    })
})

module.exports = app;