const Mealtypes = require('../Models/mealtypes');

exports.getMealTypes = (req, res) => {
    Mealtypes.find()
        .then(
            response => {
                res.status(200).json({ message: "Mealtypes Fetched Succesfully", mealtype: response })
            })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};

exports.findMealtype = (req, res) => {

    const { mealtype } = req.body;

    Mealtypes.find({
        meal_type: mealtype
    })
        .then(
            response => {
                res.status(200).json({ message: "Mealtypes Fetched Succesfully", mealtypeFilter: response })
            })
        .catch(err => {
            res.status(500).json({ error: err })
        })
};