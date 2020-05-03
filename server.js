'use strict';
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');
const methodOverride = require('method-override');
const express = require('express');
const superagent = require('superagent');
const PORT = process.env.PORT || 4000;
const client = new pg.Client(process.env.DATABASE_URL);
const morgan = require('morgan');
const app = express();
client.on('error', errorHandler);
app.use(cors());
app.use(morgan());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./public'));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
morgan('combined', {
    skip: function (req, res) { return res.statusCode < 400 }
  })
  morgan.token('type', function (req, res) { return req.headers['content-type'] })

app.get('/', getDigimon);

function getDigimon(req, res) {
    // res.send('Hello');
    let url = 'https://digimon-api.herokuapp.com/api/digimon';
    superagent.get(url)
        .then((result) => {
            let resultRes = result.body.map((data) => {
                return new Digimon(data);

            });
            res.render('index', { result: resultRes });
        }).catch((err) => errorHandler(err, req, res));
}

app.get('/add', addDigimon);
function addDigimon(req, res) {

}

app.get('/digimons', favDigimon);
function favDigimon(req, res) {
let SQL = 'SELECT * FROM digitable;';
client.query(SQL)
.then((SQLRes)=>{
res.render('/favorite',{resultKey:SQLRes.rows});
}).catch(err=>errorHandler(err,req,res));
}

function Digimon(data) {
    this.name = data.name;
    this.img = data.img;
    this.level = data.level;
}
app.use('*', notFoundHandler);
client.connect()
    .then(() => {
        app.listen(PORT, console.log(`RUNNING ON PORT ${PORT}`));
    }).catch((err) => errorHandler(err, req, res));

function errorHandler(err, req, res) {
    res.status(500).send(err);
}
function notFoundHandler(req, res) {
    res.status(404).send('PAGE NOT FOUND');
}
