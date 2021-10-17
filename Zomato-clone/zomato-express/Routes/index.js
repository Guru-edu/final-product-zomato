const express = require('express');

const route = express.Router();

const locationController = require('../Controllers/locations');
const mealtypeController = require('../Controllers/mealtypes');
const restaurantController = require('../Controllers/restaurant');
const menuItemsController = require('../Controllers/menuItems');
const paymentController = require('../Controllers/payment');
const userController = require('../Controllers/users');
const orderController = require('../Controllers/order');

route.get('/locations', locationController.getLocations);
route.post('/filterLocation', locationController.findLocation);
route.get('/mealtypes', mealtypeController.getMealTypes);
route.post('/filterMealtype', mealtypeController.findMealtype);
route.get('/restaurants/:locationId', restaurantController.getRestaurantsByLocation);
route.post('/filter', restaurantController.filterRestaurants);
route.get('/restaurant/:resId', restaurantController.getRestaurantsDetailsById);
route.get('/menuitems/:resId', menuItemsController.getMenuItemsByRestaurant);
route.post('/payment', paymentController.payment);
route.post('/callback', paymentController.callback);
route.post('/login', userController.getUsers);
route.post('/signup', userController.addUser);
route.post('/order', orderController.orderData);
route.post('/getOrder', orderController.getOrder);

module.exports = route;
