const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { Gas } = require("../model/gasModel");
const { Double } = require("mongodb");
const moment = require('moment');



getGasDetail = (req ,res ,next) =>{
    let sql = `select * from tb_gas_detail ORDER BY id ASC  `;
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

getOrderGasById = (req, res ,next) => {

};


module.exports = {

    getGasDetail,
    getOrderGasById,


};