const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: { type: Number, required: true },
    productImage: {type: String, required: true }
    //Security before empty response from FRONT END
});

module.exports = mongoose.model('Product', productSchema);