require('dotenv').config();
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');

app.use(cors());



const fileStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'images');
    },
    filename: (req, file, cb)=>{
        cb(null, uuidv4() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpg' ||file.mimetype === 'image/jpeg' ){
        cb(null, true);
    } else { cb(null, false); }
}

app.use(bodyParser.json());

app.use(multer({ storage: fileStorage, fileFilter: fileFilter}).single('image'));


app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/feed', feedRoutes);
app.use('/auth', authRoutes);

app.use((error, req, res, next)=>{
    console.log(error);
    const status = error.statusCode || 500;
    const mssg = error.message;
    const data = error.data
    res.status(status).json({message: mssg, data: data});
});

mongoose.connect(process.env.DRIVER_URL2)
.then((result) => { 
    const server = app.listen(8080);
    const io = require('./socket').init(server);
    io.on('connection', (socket)=>{
        console.log('client connected');
    })
 })
.catch((err) => { console.log(err); });
