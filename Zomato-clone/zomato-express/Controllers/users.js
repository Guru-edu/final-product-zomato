const Users = require('../Models/users')

exports.getUsers = (req, res) => {
    const { email, password } = req.body;

    Users.find({
        email,
        password
    })
        .then(response => {
            if (response.length > 0) {
                res.status(200).json({ key: true, message: "User Logged In Successfully", isAuthenticated: true, user: response })
            }
            else {
                res.status(200).json({ key: false, message: "User login failed", isAuthenticated: false })
            }
        })
        .catch()
}

exports.addUser = (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body;
    const newUser = new Users({ email, password, firstname, lastname });


    if (confirmPassword == password) {
        if (email) {
            Users.find({ email })
                .then(result => {

                    if (result.length > 0) {
                        res.status(200).json({ key: false, message: "Email already registered" })
                    }
                    else {
                        newUser.save()
                            .then(result => {
                                res.status(200).json({ key: true, message: "User Created successfull", user: result })
                            })
                            .catch()
                    }
                }).catch()
        }
    } else {
        res.status(200).json({ key: false, message: "Password mismatch" })
    }
}
