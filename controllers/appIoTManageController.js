const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider , Order } = require("../model/userModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');
const { insertIoTMongoDB } = require('../function/functionMongoDB');


const { Double } = require("mongodb");
const moment = require('moment');
const { IoT , IoTData , Gas} = require("../model/gasModel");
// const { resetGasIoT } = require("./gasController");
saltRounds = process.env.SALTROUND_SECRET ;

const tb_mongodb_iot = 'tb_test' ;
const tb_map_around = process.env.DB_MONGODB_AROUND ;




//#region iot device 



//#region GET iot device

getIoTByUserId = (req ,res,next) => {
     
    let userID = req.query.user_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    if(userID == "" || userID == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( user_id )";    
        res.status(200).json(resData);
    }
    else{
        let sql = `SELECT "id","serialNumber" , "createDate" , tb_register_iot.lat, 
                    tb_register_iot.lon FROM tb_register_iot
                    WHERE tb_register_iot."isDelete" = 0 AND tb_register_iot.user_id = '${userID}' `;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        statusCode : 200,
                        data : err
                    }   
                    res.status(200).json(data)
                }
                else
                {
                    let data = {
                        status : "success",
                        statusCode : 201,
                        data : result.rows
                    }
                    res.status(201).json(data);
                }
            }
        );
    }

}

getIoTDeviceAll = (req , res,next) =>{
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    
    let sql = `SELECT tb_register_iot."id" , tb_register_iot."serialNumber" , tb_register_iot."createDate" ,
                tb_user.email , tb_user.phone , tb_user."id" ,
                tb_register_iot.lat, tb_register_iot.lon FROM tb_register_iot
                INNER JOIN tb_user ON tb_user."id" = tb_register_iot.user_id
                WHERE tb_register_iot."isDelete" = 0`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    statusCode : 200,
                    data : err
                }   
                res.status(200).json(data)
            }
            else
            {
                let data = {
                    status : "success",
                    statusCode : 201,
                    data : result.rows
                }
                res.status(201).json(data);
            }
        }
    );
    
}


getApproveJoinIoTByUserId = (req , res,next) => {
    let userID = req.query.user_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    if(userID == "" || userID == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( user_id )";    
        res.status(200).json(resData);
    }
    else{
        let sql = `SELECT * FROM tb_join_iot 
                    WHERE tb_join_iot.status = '0' AND tb_join_iot.user_main_id = ${user_id} `;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        statusCode : 200,
                        data : err
                    }   
                    res.status(200).json(data)
                }
                else
                {
                    let data = {
                        status : "success",
                        statusCode : 201,
                        data : result.rows
                    }
                    res.status(201).json(data);
                }
            }
        );
    }
}

getJoinIoTByUserId = (req , res,next) => {
    let userID = req.query.user_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    if(userID == "" || userID == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( user_id )";    
        res.status(200).json(resData);
    }
    else{
        let sql = `SELECT * FROM tb_join_iot 
                    WHERE tb_join_iot.user_main_id = ${user_id} `;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        statusCode : 200,
                        data : err
                    }   
                    res.status(200).json(data)
                }
                else
                {
                    let data = {
                        status : "success",
                        statusCode : 201,
                        data : result.rows
                    }
                    res.status(201).json(data);
                }
            }
        );
    }
}

//#endregion




//#region POST iot device

registerIoT = async (req ,res ,next) =>{
    let dataBody = req.body ;
    let dataIoT = new IoT();
    // console.log(dataBody)
    dataIoT.user_id = dataBody.user_id;
    dataIoT.serialNumber = dataBody.serialNumber ;    
    dataIoT.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataIoT.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataIoT.lat = dataBody.lat ;
    dataIoT.lon = dataBody.lon ;

    let checkParameter = await funCheckParameterWithOutId(dataIoT);
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    if(checkParameter != "" )
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";            
        res.status(200).json(resData);
    }
    else
    {      
        let sql = `SELECT id FROM tb_register_iot
                    WHERE tb_register_iot."serialNumber" = '${dataIoT.serialNumber}' AND
                    tb_register_iot."isDelete" = 0`;
        console.log(sql)
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if(result.rows.length > 0){
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "Duplicate username";
                    res.status(200).json(resData);
                }
                else
                {              
                    sql = `INSERT INTO "public"."tb_register_iot"("user_id", "serialNumber", "createDate", 
                    "modifyDate","lat","lon" ,"isDelete") 
                    VALUES (${dataIoT.user_id}, '${dataIoT.serialNumber}', '${dataIoT.createDate}'
                    , '${dataIoT.modifyDate}' , '${dataIoT.lat}' , '${dataIoT.lon}' , 0) RETURNING *`;
                    console.log(sql)
                    pool.query(
                        sql, 
                        async (err, result) => {
                            //console.log(err)
                            if (err) {
                                //console.log(err);                      
                                resData.status = "error";
                                resData.statusCode = 200 ;
                                resData.data = "query command error tb_register_iot : " + err;
                                res.status(200).json(resData);
                            }
                            else
                            {
                                // insert mongodb
                                let newDate = new Date();  
                                newDate.setHours(newDate.getHours()+7);
                                let dataMongo = {
                                    serialNumber :  dataIoT.serialNumber ,
                                    around : 1,
                                    dateTime : newDate
                                };

                                let tbMongoMap = process.env.DB_MONGODB_AROUND ;
                                MongoClient.connect(URL_MONGODB_IOT, async function (err,db){
                                    let dbo = db.db(process.env.DATABASE_DATA_IOT);
                                    let status = false;       
                                    await dbo.collection(tbMongoMap)
                                    .insertOne( dataMongo ,async (err,result)=>
                                    {
                                        if(err)
                                        {             
                                            resData.status = "error";
                                            resData.statusCode = 200 ;
                                            resData.data = "query command error mongodb tb_map_around : " + err;
                                            res.status(200).json(resData);                                        }
                                        else
                                        {                
                                            resData.status = "success";
                                            resData.statusCode = 201 ;
                                            resData.data = "insert complete";
                                            res.status(200).json(resData);
                                        } 
                                    });       
                                });
                                                                
                            }
                        }
                    );
                }
            }
        );

    }
} 

editIotByUserId = async (req ,res, next) =>{
    //UPDATE "public"."tb_register_iot" SET "serialNumber" = 'GASIOT000002', "modifyDate" = '2020-10-22 17:40:11', "lat" = '10.12', "lon" = '10.01' WHERE "id" = 18
    let dataIoT = new IoTData;
    let dataBody = req.body;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }     
    dataIoT.id = dataBody.iot_id;
    dataIoT.serialNumber = dataBody.serialNumber;
    dataIoT.lat = dataBody.lat ;
    dataIoT.lon = dataBody.lon ;
    dataIoT.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let checkParameter = await funCheckParameter(dataIoT);


    if(checkParameter != "" ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_register_iot" SET "serialNumber" = '${dataIoT.serialNumber}', 
                    "modifyDate" = '2020-10-22 17:40:11',
                    "lat" = '${dataIoT.lat}', "lon" = '${dataIoT.lon}' WHERE "id" = ${dataIoT.id}`;
        pool.query(
            sql, 
            (err, result) => {
    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error update tb_register_iot : " + err;    
                    res.status(200).json(resData);
                }
                else
                {
                    resData.status = "success";
                    resData.statusCode = 201 ;
                    resData.data = "update complete";    
                    res.status(201).json(resData);
                }
            }
        );
    }
}

deleteIoTByUserId = async (req, res, next) =>{
    //UPDATE "public"."tb_register_iot" SET "isDelete" = 0 WHERE "id" = 18
    let iot_id = req.body.iot_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }     
    if(iot_id == "" || iot_id == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( iot_id )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_register_iot" SET "isDelete" = 1 WHERE "id" = ${iot_id}`;
        pool.query(
            sql, 
            (err, result) => {
    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error delete tb_register_iot : " + err;    
                    res.status(200).json(resData);
                }
                else
                {
                    resData.status = "success";
                    resData.statusCode = 201 ;
                    resData.data = "delete complete";    
                    res.status(201).json(resData);
                }
            }
        );
    }
   
}

resetGasIoT = (req , res , next) =>{
    // let data = req.body ;
    let data = new Gas();
    //let dataBody = req.query ;
    data.serialNumber = req.body.serialNumber ;
    let resData = {
        status : "",
        statuCode : 200 ,
        data : ""
    } 
    console.log(data)
    MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
    {
        if (err) throw err;
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        dbo.collection(tb_map_around)
        .find(
            { serialNumber: { $eq : data.serialNumber } } ,
            { _id : 0}
        )
        .toArray(async function(err, result) 
        {
            //console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
            console.log(result.length );
            if (err) 
            {
                //console.log(err);                      
                resData.status = "error" ; 
                resData.statuCode = 200 ;
                resData.data = "query command error :" + err ;
                res.status(resData.statuCode).json(resData)
            }
            else
            {               
                   
                if(result.length > 0)
                {
                    let nextAround = result[0].around + 1 ; 
                    let newDate = new Date();  
                    newDate.setHours(newDate.getHours()+7);
                    let queryWhere = {
                        serialNumber : data.serialNumber
                    }
                    let newValue = {
                        $set : {
                            around : nextAround,
                            dateTime : newDate
                        }
                    }
                    dbo.collection(tb_map_around)
                    .updateOne(queryWhere,newValue,(err,result)=>
                    {
                        if(err)
                        {
                            resData.status = "success"; 
                            resData.data = result;
                            res.status(resData.statuCode).json(resData);  
                        }
                        else
                        {                
                            resData.status = "success"; 
                            resData.statuCode = 201 ;
                            resData.data = "reset complete";
                            res.status(resData.statuCode).json(resData);  
                        }
                    });
                }             
            }
            db.close();
        });
    });

















    
} 


//#endregion


//#endregion  
















//#region xx


 




//#endregion

// INSERT INTO "public"."tb_join_iot"("use_main_id", "user_join_id", "status", "createdate") VALUES (15, 16, '0', '2021-02-03 11:48:11') RETURNING *
// UPDATE "public"."tb_join_iot" SET "status" = '1' WHERE "id" = 1

module.exports = {
   registerIoT,
   getIoTByUserId,
   getIoTDeviceAll,
   deleteIoTByUserId,
   editIotByUserId,
   resetGasIoT,
   getApproveJoinIoTByUserId,
   getJoinIoTByUserId
}; 