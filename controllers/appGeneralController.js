const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position , Rider , Order } = require("../model/userModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');
const bcrypt = require('bcrypt');
saltRounds = process.env.SALTROUND_SECRET ;


// GET

getProvince = (req , res , next) => {
    let sql = `select id , name_th , name_en from tb_provinces ORDER BY id ASC `;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : ""
                }   
                res.status(400).json(data)
            }
            else
            {
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
            }
        }
    );

};

getAmphure = (req , res, next) => {

    let idProvince = req.query.idProvince ;
    if(idProvince == null || idProvince == "")
    {
        let data = {
            status : "error",
            data : "not have idProvince"
        }   
        res.status(400).json(data)
    }
    else
    {
        let sql = `select id , name_th, name_en from tb_districts where province_id =`+parseInt(idProvince)+` ORDER BY id ASC `;
        pool.query(
            sql, 
            (err, result) => {
    
                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : "query command error"
                    }   
                    res.status(400).json(data);
                }
                else
                {
                    let data = {
                        status : "success",
                        data : result.rows
                    }
                    res.status(200).json(data);
                }
            }
        );
    }

   
};

getDistrict = (req, res, next) =>{
    let idAmphure = req.query.idAmphure ;
    if(idAmphure == null || idAmphure == "")
    {
        let data = {
            status : "error",
            data : "not have idAmphure"
        }   
        res.json(data)
    }
    let sql = `select id , name_th,name_en,zip_code from tb_subdistricts where district_id = `+parseInt(idAmphure)+` ORDER BY id ASC `;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : "query command error"
                }   
                res.status(400).json(data);
            }
            else
            {
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
            }
        }
    );
}

getBankAll = (req, res,next) =>{
    let resData = {
        status : "",
        statuCode : 200 ,
        data : ""
    }   
    let sql = `SELECT * FROM tb_bank_detail`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err); 
                resData.status = "error"; 
                resData.statuCode = 200 ;
                resData.data = err ;
                res.status(resData.statuCode).json(resData)
            }
            else
            {    
                resData.status = "success"; 
                resData.statuCode = 201 ;
                resData.data = result.rows ;
                res.status(resData.statuCode).json(resData);
            }
        }
    );
};

getPaymentChannel = (req,res,next)=>{
    let resData = {
        status : "",
        statuCode : 200 ,
        data : ""
    }   
    let sql = `SELECT * FROM "public"."tb_payment_channel"`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err); 
                resData.status = "error"; 
                resData.statuCode = 200 ;
                resData.data = err ;
                res.status(resData.statuCode).json(resData)
            }
            else
            {    
                resData.status = "success"; 
                resData.statuCode = 201 ;
                resData.data = result.rows ;
                res.status(resData.statuCode).json(resData);
            }
        }
    );
}

module.exports = {
    getProvince,
    getAmphure,
    getDistrict,
    getBankAll,
    getPaymentChannel
}
