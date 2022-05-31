const cartModel = require('../Models/cartModel');
const productModel = require('../Models/productModel')
const userModel = require("../Models/userModel");
const orderModel = require("../Models/orderModel")
const { isValidRequestBody, isValidObjectId, isEmpty } = require("../Utilites/validation");


//--------------------------Create Order--------------------------------------------------------//
const createOrder = async (req, res) => {
    try {
        const userId = req.params.userId
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Invalid userId ID" })

        const data = req.body
        if (isValidRequestBody(data))
            return res.status(400).send({ status: false, message: "Empty request body" });

        const { cartId } = data
        if (isEmpty(cartId)) return res.status(400).send({ status: false, message: "cart ID required" })
        if (!isValidObjectId(cartId))
            return res.status(400).send({ status: false, message: "Invalid cart ID" })

        const findUser = await userModel.findOne({ _id: userId })
        if (!findUser) return res.status(404).send({ status: false, message: "User does not exists" })

        const tokenUserId = req.decodeToken.userId;
        if (tokenUserId !== findUser._id.toString())
            return res.status(403).send({ status: false, message: "Unauthorized access" });

        const findCart = await cartModel.findOne({ userId: userId })
        if (!findCart) return res.status(404).send({ status: false, message: "No cart found" })
        if (findCart.items.length === 0) return res.status(400).send({ status: false, message: "No Items in cart" })
        if(cartId!==findCart._id){
            return res.status(400).send({ status: false, message: `Cart does not belong to ${findUser.fname} ${findUser.lname}` })
        }

        let totalQ = 0
        let cartItems = findCart.items
        let productId
        for (let i = 0; i < cartItems.length; i++) {
            totalQ += cartItems[i].quantity
            productId = cartItems[i].productId.toString();
        }
<<<<<<< HEAD
        let itemsarr = validCart.items
        let count = 0
        for (let i = 0; i < itemsarr.length; i++) {

            count += itemsarr[i].quantity
        }
        //let length = validCart.items
        let obj = {
            userId: userId,
            items: validCart.items,
            totalPrice: validCart.totalPrice,
            totalItems: validCart.items.length,
            //  isDeleted:false,
            totalQuantity: count
        }
        // let length = validCart.items.quantity
        // console.log(length);
        // obj['totalQuantity'] = validCart.items.
        let result = await orderModel.create(obj)
        console.log(obj)
        return res.send({ status: true, message: 'Success', data: result })
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
}

const updateOrder = async (req, res) => {
    let data = JSON.parse(JSON.stringify(req.body));
    if (isValidRequestBody(data))
        return res.status(400).send({ status: false, message: "Body cannot be empty" });
    let userId = req.params.userId
    if (!isValidObjectId(userId))
        return res.status(400).send({ status: false, message: "Invalid userId ID" })
    const tokenUserId = req.decodeToken.userId;
    let {cartId,status,cancellable,isDeleted} = data 
    if (cartId) {
        if (!isValidObjectId(cartId))
            return res.status(400).send({ status: false, message: "Invalid cart ID" })
    }
    if(status){
       if(!isEmpty(status)) {
           
       }
    }
    if(cancellable){
        
    }
    if(isDeleted){
        
    }
    // user validation
    let validUser = await userModel.findOne({ _id: userId })
    if (!validUser)
        return res.status(404).send({ status: false, message: "User does not exists" })
    // user authorization    
    if (validUser._id.toString() !== tokenUserId)
        return res.status(403).send({ status: false, message: "Unauthorized access" })

}
module.exports = { createOrder, updateOrder }
=======
        let validProduct = await productModel.findOne({ _id: productId, isDeleted: true })
        if (validProduct)
            return res.status(404).send({ status: false, message: `${validProduct.title} Product in your cart has been deleted` })

        const orderDetails = {}
        orderDetails['userId'] = userId
        orderDetails['items'] = findCart.items
        orderDetails['totalPrice'] = findCart.totalPrice
        orderDetails['totalItems'] = findCart.items.length
        orderDetails['totalQuantity'] = totalQ

        //Change in cart model
        findCart.items = []
        findCart.totalItems = 0
        findCart.totalPrice = 0

        await findCart.save()
        const getOrder = await orderModel.create(orderDetails)
        if (!getOrder) return res.status(400).send({ status: true, message: "Order not Placed" })

        let obj = {
            userId: getOrder.userId,
            items: getOrder.items,
            totalPrice: getOrder.totalPrice,
            totalItems: getOrder.totalItems,
            totalQuantity: getOrder.totalQuantity,
            cancellable: true,
            status: "pending",
            _id: getOrder._id,
            createdAt: getOrder.createdAt,
            updatedAt: getOrder.updatedAt
        }
        return res.status(201).send({ status: true, message: "Order Placed Success", data: obj })

    } catch (err) {
        return res.status(500).send({ err: err.message });
    }

}

//Update Order details
const updateOrder = async(req,res)=>{
    try{
        const userId = req.params.userId
        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Invalid userId ID" })

        const data = req.body
        if (isValidRequestBody(data))
            return res.status(400).send({ status: false, message: "Empty request body" })

        const { orderId, status } = data


        if (isEmpty(orderId)) return res.status(400).send({ status: false, message: "Order Id required" })
        if (isEmpty(status)) return res.status(400).send({ status: false, message: "please enter status." })

        if (!isValidObjectId(orderId))
            return res.status(400).send({ status: false, message: "Invalid order ID" })

            const validUser = await userModel.findOne({ _id: userId })
            if (!validUser) return res.status(404).send({ status: false, message: "User does not exists" })

            const tokenUserId = req.decodeToken.userId;
            if (tokenUserId !== validUser._id.toString())
                return res.status(403).send({ status: false, message: "Unauthorized access" })
            
            const validOrder = await orderModel.findOne({_id : orderId}) 
            if (!validOrder) return res.status(404).send({ status: false, message: "Order does not exists" })
            if(userId !== validOrder.userId.toString())
            return res.status(400).send({ status: false, message: `Order does not belong to ${validUser.fname} ${validUser.lname}` })

            if(['pending', 'completed', 'cancelled'].indexOf(status) === -1)
            return res.status(400).send({ status: false, message: `Order status should be 'pending', 'completed', 'cancelled' ` })

            if(status == 'cancelled'){
                if(validOrder.cancellable== false)
                return res.status(400).send({ status: false, message: "This order is not cancellable." })
            }

            validOrder.status = status
            await validOrder.save()
            return res.status(200).send({status:true, message:`Status upadated to ${status}`, data:validOrder})
    }catch (err) {
        return res.status(500).send({ err: err.message });
    }
}

module.exports = { createOrder,updateOrder }
>>>>>>> 55847ca84cab792795587748eb8e5ffa5b28ade1

