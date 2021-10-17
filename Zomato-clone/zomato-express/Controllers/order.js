const orderList = require('../Models/order')

exports.orderData = (req, res) => {

    const { resName, user, name, address, items, subTotal } = req.body;

    const order = new orderList({ restaurantName: resName, user, placedBy: name, location: address, items, amount: subTotal });

    order.save()
        .then(result => {
            res.status(200).json({ message: "Order Saved Successfully", orders: result })
        })
        .catch()
}

exports.getOrder = (req, res) => {
    const { user } = req.body;

    orderList.find({ user }).then(response => {
        res.status(200).json({ messsage: "order Fetched Successfully", orders: response })
    })
        .catch(err => { res.status(500).json({ message: "No Orders Found" }) })
}