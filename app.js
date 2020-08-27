const express = require('express');
const app  = express();
//const morgan = require('morgan')


//app.use(morgan('dev')); // เเสดงการทำงาน

app.get('/',(req , res , next) =>{  // path /

    res.status(200).json({
        message : 'Get rootdd /'
    })

})

module.exports = app ;