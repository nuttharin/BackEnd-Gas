const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { Gas } = require("../model/gasModel");
const { Double } = require("mongodb");
const moment = require('moment');
// const { getPercentPressureBySerialNumber } = require("./gasController");

// const tb_mongodb_iot = process.env.DB_MONGODB_PRESSURE ;
const tb_mongodb_iot = 'tb_test' ;
const tb_map_around = process.env.DB_MONGODB_AROUND ;



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
    //let dataBody = req.query ;
    data.serialNumber = req.query.serialNumber ;
    let resData = {
        status : "",
        statuCode : 200 ,
        data : ""
    }   
    //data.serialNumber = 'A111111111'
    if( data.serialNumber == null ||  data.serialNumber == "")
    {
        resData.status = "error" ; 
        resData.statuCode = 200 ;
        resData.data = "not have parameter is serialNumber" ;
        res.status(resData.statuCode).json(resData)
    }
    else
    {
        MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
        {            
            let dbo = db.db(process.env.DATABASE_DATA_IOT);
            let timeAround ;
            // find time
            dbo.collection(tb_map_around)
            .find(
                { serialNumber: { $eq : data.serialNumber } } ,
                { _id : 0}
            )
            .toArray(async function(err, result) 
            {
                if(err)
                {
                    resData.status = "error" ; 
                    resData.statuCode = 200 ;
                    resData.data = "query command error :" + err ;
                    res.status(resData.statuCode).json(resData)
                }
                else{
                    timeAround = result[0].dateTime ;  
                    // console.log(timeAround)

                    var mysort = { dateTime : -1 };
                    // db.gpsdatas.find({"createdAt" : { $gte : new ISODate("2012-01-12T20:15:31Z") }});
                    dbo.collection(tb_mongodb_iot)
                    .find(
                        { 
                            "serialNumber" : { $eq : data.serialNumber } ,
                            "dateTime" : { $gte : timeAround }
                        } 
                    )
                    .sort(mysort)
                    .limit(3)
                    .toArray(async function(err, result) 
                    {
                        console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
                        console.log(result);
                        delete result[0]._id ;
                        result[0].dateTime = moment(result[0].dateTime).format(' D/MM/YYYY HH:mm:ss');
                        if (err) 
                        {
                            //console.log(err);                      
                            resData.status = "error" ; 
                            resData.statuCode = 200 ;
                            resData.data = "query command error :" + err ;
                            res.status(resData.statuCode).json(resData) ;
                        }
                        else
                        {
                            if(result.length > 0)
                            {
                                console.log(result)
                                let arrPressure = { };
                                let voltPressure = result[0].pressure ;
                                let percentPressure ;
                                // let statusOpen = "Close";  
                                // if(result.length == 3)
                                // {
                                //     arrPressure = await {
                                //         pressure0 : result[0].pressure,
                                //         pressure1 : result[1].pressure,
                                //         pressure2 : result[2].pressure
                                //     }                                    
                                // }
                                // else if (result.length == 2)
                                // {
                                //     arrPressure = await {
                                //         pressure0 : result[0].pressure,
                                //         pressure1 : result[1].pressure
                                //     }
                                // } 
                                // else if (result.length == 1)
                                // {
                                //     arrPressure = await {
                                //         pressure0 : result[0].pressure                                       
                                //     }
                                // }
                               
                               
                                console.log(arrPressure)
                                 
    
                                if(voltPressure <= 0.5 && voltPressure >= 0)
                                {
                                    percentPressure = 0 ;
                                    result[0].pressure = await percentPressure ;
                                }
                                else if(voltPressure >= 4.4 && voltPressure <= 4.5)
                                {
                                    percentPressure = 100 ;
                                    result[0].pressure = await percentPressure ;
            
                                }
                                else if (voltPressure > 0.5 && voltPressure < 4.5) {
                                    percentPressure = Math.ceil((voltPressure/4.4)*100) ;
                                    if(percentPressure >= 100)
                                    {
                                        percentPressure = 100 ;                                
                                    }
                                    result[0].pressure = await percentPressure ;
                                }
                                else {
                                    percentPressure = "Error value" ;
                                    result[0].pressure = await percentPressure ;
                                }
    
                                resData.status = "success"; 
                                resData.statuCode = 201 ;
                                resData.data = result[0] ;
                                res.status(resData.statuCode).json(resData) ; 
                            }
                            else
                            {
                                resData.status = "success"; 
                                resData.statuCode = 201 ;
                                resData.data = result ;
                                res.status(resData.statuCode).json(resData) ;
                            }
                                               
                        }            
                        db.close();
                        //console.log(result)
                    })
                }
            });

           
        });
    }
};



//#endregion
//#endregion





module.exports = {

    getGasDetail,
    getPercentPressureBySerialNumber


};