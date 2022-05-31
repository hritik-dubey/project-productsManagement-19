const mongoose = require('mongoose')
const { numCheck } = require('../Utilites/validation')
const ObjectId = mongoose.Schema.Types.ObjectId

const orderSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true,
        trim: true,
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            trim: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        trim: true,
    },           // comment: "Holds total price of all the items in the cart"

    totalItems: {
        type: Number,
        required: true,
        trim: true,
    },          //comment: "Holds total number of items in the cart"
    totalQuantity: {
        type: Number,
        required: true,
        trim: true,
    },         // comment: "Holds total number of quantity in the cart"
    cancellable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'pending',
        enum: ['pending', 'completed', 'cancled']
    },
    deletedAt: {
        type: Date
    },
    isDeleted: {
        tepe: Boolean,
        default: false
    },
},{timestamps:true})


module.exports = mongoose.model('Order', orderSchema)