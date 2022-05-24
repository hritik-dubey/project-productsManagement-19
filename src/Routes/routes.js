const express = require("express");
const router = express.Router()

const userController = require('../Controllers/userController')
const productController = require('../Controllers/productController')
const cartController = require('../Controllers/cartController')
const orderController = require('../Controllers/orderController')


router.get('/test-server', (req,res)=>{
    res.status(200).send({status:true, message:"SERVER UP!!"})
})




module.exports = router