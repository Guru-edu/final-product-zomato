const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./Routes/index');

const host = 'localhost';
const port = 2209;

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json());
app.use('/', routes);

mongoose.connect('mongodb+srv://guru:35urKMaXtrBQl26z@cluster0.am6as.mongodb.net/zomato?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(res => {
        app.listen(port, host, () => {
            console.log(`Server is running at ${host}:${port}`);
        });
    })
    .catch(err => console.log(err))

