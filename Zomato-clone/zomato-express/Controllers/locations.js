const Locations = require('../Models/locations');

exports.getLocations = (req, res) => {
    Locations.find()
        .then(
            response => {
                res.status(200).json({ message: "Locations Fetched Succesfully", location: response })
            }
        )
        .catch(
            err => {
                res.status(500).json({ message: "Error", error: err })
            }
        )
}

exports.findLocation = (req, res) => {

    const { location } = req.body;

    Locations.find({
        location_id: location
    })
        .then(response => {
            res.status(200).json({ message: "Locations Fetched Succesfully", locationFilter: response })
        })
        .catch(
            err => {
                res.status(500).json({ message: "Error", error: err })
            }
        )
}

