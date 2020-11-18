const express = require('express');
const app  = express();

const compression = require('compression');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mongoClient = require('mongodb');
const moment = require('moment');


require('dotenv').config()




app.use(morgan('dev')); // เเสดงการทำงาน


app.use(bodyParser.urlencoded({extended : false})); // false ใช้อัลกอในการ map json ธรรมดา ,true = high
app.use(bodyParser.json());
app.use(compression());
app.use(express.static('uploads'));

//---------------Access-Control-Allow-Origin----------
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Orgin, X-Requested-With, Content-Type, Accept,Authorization,authorization,content-type');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next(); // ไปต่อ
})



//set Router
const testRouter = require('./routes/testRoute');
const userRouter = require('./routes/userRoute');
const gasRouter = require('./routes/gasRoute');
const appGasRouter = require('./routes/appGasRoute');

//set path 

app.use('/test',testRouter);
app.use('/user',userRouter);
app.use('/gas',gasRouter);
app.use('/app',appGasRouter);

app.use('/pictureRegisterUser', express.static('./upload/picture/register'));
app.use('/pictureRegisterDriver', express.static('./upload/picture/register_driver'));
app.use('/pictureProfile' , express.static('./upload/picture/profile'))
//app.use('/static', express.static('z'))


// app.get('/',(req , res , next) =>{  // path /

//     res.status(200).json({
//         message : 'Get rootdd /'
//     })

// })


// app.post('/pic',upload.single('profile') , (req,res,next) =>{
//     console.log(req.file)
//     console.log(req.body.d)
//     res.status(200).json("xx")
// })


//set path

module.exports = app ;