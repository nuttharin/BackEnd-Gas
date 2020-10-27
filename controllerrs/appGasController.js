const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { Gas } = require("../model/gasModel");
const { Double } = require("mongodb");
const moment = require('moment');
// const { getPercentPressureBySerialNumber } = require("./gasController");

// const tb_mongodb_iot = process.env.DB_MONGODB_PRESSURE ;
const tb_mongodb_iot = 'tb_test' ;



//#region iot device
//#region GET

getGasDetail = (req ,res ,next) =>{
    let sql = `select * from tb_gas_detail ORDER BY id ASC  `;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    statuCode : 200 ,
                    data : err
                }   
                res.status(200).json(data)
            }
            else
            {
                let data = {
                    status : "success",
                    statuCode : 201 ,
                    data : result.rows
                }
                res.status(data.statuCode).json(data);
            }
        }
    );
};

getPercentPressureBySerialNumber = (req ,res ,next) =>{
    let data = new Gas();
    let dataBody = req.query ;
    data.serialNumber = req.query.serialNumber ;
    //data.serialNumber = 'A111111111'
    if( data.serialNumber == null ||  data.serialNumber == "")
    {
        let data = {
            status : "error",
            data : "not have parameter is serialNumber"
        }   
        res.json(data)
    }
    else
    {
        MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
        {
            if (err) throw err;
            let dbo = db.db(process.env.DATABASE_DATA_IOT);
            var mysort = { dateTime : -1 };
            dbo.collection(tb_mongodb_iot)
            .find(
                { serialNumber: { $eq : data.serialNumber } } ,
                {_id : 0}
            )
            .sort(mysort).limit(-1)
            .toArray(function(err, result) 
            {
                //console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
                console.log(result[0]);
                result[0].dateTime = moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss');
                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : "query command error"
                    }   
                    res.json(data);
                }
                else
                {
                    let data = {
                        status : "success",
                        data : result[0]
                    }
                    res.json(data);
                }
    
                db.close();
            });
        });
    }
}

//#endregion
//#endregion





module.exports = {

    getGasDetail,
    getPercentPressureBySerialNumber


};