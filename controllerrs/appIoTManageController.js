const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider , Order } = require("../model/userModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');


const { Double } = require("mongodb");
const moment = require('moment');
const bcrypt = require('bcrypt'); 
const { IoT } = require("../model/gasModel");
saltRounds = process.env.SALTROUND_SECRET ;


//#region GET

getUserDetailById = (req ,res ,next) =>{
    let userID = req.query.userID ;

    let sql = `SELECT tb_user.id , tb_user.name , tb_user.email , tb_user.phone from tb_user
    LEFT JOIN tb_address_user on tb_address_user.user_id = tb_user.id
    LEFT JOIN tb_province on tb_province.id = tb_address_user.province_id
    LEFT JOIN tb_amphure on tb_amphure.id = tb_address_user.amphure_id
    LEFT JOIN tb_district on tb_district.id = tb_address_user.district_id
    WHERE tb_user.id = ${userID}`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : err
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

getUserAddressByUserId = (req ,res ,next) =>{
    let userID = req.query.userID ;
    let resData = {
        status : "",
        data : ""
    }   
    let sql = `SELECT tbAdd."id",tbADD.name_address,
            tbAdd.province_id , tbAdd.amphure_id , tbAdd.district_id,
            tbAdd.road , tbAdd.other , tbAdd.latitude, tbAdd.longitude,
            tbP.name_th as province, tbA.name_th as amphure, tbD.name_th as district
            
            FROM tb_address_user as tbAdd
            LEFT JOIN tb_province as tbP on tbP.id = tbAdd.province_id
            LEFT JOIN tb_amphure as tbA on tbA.id = tbAdd.amphure_id
            LEFT JOIN tb_district as tbD on tbD.id = tbAdd.district_id
            WHERE  tbAdd.user_id = ${userID}`;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                
            }
            else
            {        
                resData.status = "success";
                resData.data = result.rows;
                // console.log(result.rows[0].id)
                res.status(200).json(resData);
            }
        }
    );
};

getUserAddressByAddressId = (req ,res ,next) =>{
    let addressID = req.query.addressID ;
    let resData = {
        status : "",
        data : ""
    }   
    let sql = `SELECT tbAdd."id",tbADD.name_address,
                tbAdd.province_id , tbAdd.amphure_id , tbAdd.district_id,
                tbAdd.road , tbAdd.other , tbAdd.latitude, tbAdd.longitude,
                tbP.name_th as province, tbA.name_th as amphure, tbD.name_th as district
                
                FROM tb_address_user as tbAdd
                LEFT JOIN tb_province as tbP on tbP.id = tbAdd.province_id
                LEFT JOIN tb_amphure as tbA on tbA.id = tbAdd.amphure_id
                LEFT JOIN tb_district as tbD on tbD.id = tbAdd.district_id
                WHERE tbAdd.id  = ${addressID}`;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                resData.status = "error";
                resData.data = "query command error";
                res.status(400).json(resData);
            }
            else
            {        
                resData.status = "success";
                resData.data = result.rows[0];
                // console.log(result.rows[0].id)
                res.status(200).json(resData);
            }
        }
    );
};






//#endregion


//#region POST
 
registerIoT = async (req ,res ,next) =>{
    let dataBody = req.body ;
    let dataIoT = new IoT();


    
    dataUser.name= dataBody.name ;
    dataUser.password = dataBody.password ;
    dataUser.idCard = dataBody.idCard ;
    dataUser.email = dataBody.email;
    dataUser.phone = dataBody.phone;         
    dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');

    // dataAddress.user_id = dataBody.;
    dataAddress.province_id = dataBody.province ;
    dataAddress.amphure_id = dataBody.amphure ;
    dataAddress.district_id = dataBody.district ;
    dataAddress.road = dataBody.road;
    dataAddress.other = dataBody.other;
    dataAddress.name_address = dataBody.name_address;
    dataAddress.lat = dataBody.lat ;
    dataAddress.lon = dataBody.lon ;


    let resData = {
        status : "",
        data : ""
    }   
    
    let checkParameter = await funCheckParameterWithOutId(dataUser);
    if(checkParameter != "" || checkParameter2 != "")
    {
        //console.log(checkParameter)
        if(checkParameter != "") {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter +" )";    
            res.status(400).json(resData);
        }
        else {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter2 +" )";    
            res.status(400).json(resData);
        }
        
        
    }
    else
    {
       
       
        //INSERT INTO "public"."tb_register_iot"("user_id", "serialNumber", "createDate", "modifyDate") VALUES (1, 'GASIOT000001', '2020-10-19 11:49:39', '2020-10-19 11:49:41') RETURNING *
        let sql = `INSERT INTO "public"."tb_user"("name", "password", "idCard", "email", "phone", "createDate", "modifyDate") 
                   VALUES ('${dataUser.name}', '${dataUser.password}', '${dataUser.idCard}', '${dataUser.email}', '${dataUser.phone}'
                   , '${dataUser.createDate}', '${dataUser.modifyDate}') RETURNING *`;
        // console.log(sql)
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error tb_user: " + err;
                    res.status(400).json(resData);
                }
                else
                {
                    sql = `INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id",
                        "road", "other", "name_address", "latitude", "longitude") 
                        VALUES (${result.rows[0].id}, ${dataAddress.province_id}, ${dataAddress.amphure_id},
                        '${dataAddress.district_id}', '${dataAddress.road}', '${dataAddress.other}',
                        '${dataAddress.name_address}', '${dataAddress.lat}', '${dataAddress.lon}') 
                        RETURNING *`;                   
                              
                    pool.query(
                        sql, 
                        (err, result) => {
                            //console.log(err)
                            if (err) {
                                resData.status = "error";
                                resData.data = "query command error tb_address_user: " + err;
                                res.status(400).json(resData);
                            }
                            else
                            {      
                                resData.status = "success";
                                resData.data = "insert complete";
                                res.status(200).json(resData);
                            }
                        }
                    );
                }
            }
        );
    }
} 


//#endregion


//#region xx
registerUser = async (req , res , next) =>{ 
    let dataBody = req.body ;
    let dataUser = new User();
    let dataAddress = new Position();
    dataUser.name= dataBody.name ;
    dataUser.password = dataBody.password ;
    dataUser.idCard = dataBody.idCard ;
    dataUser.email = dataBody.email;
    dataUser.phone = dataBody.phone;         
    dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');

    // dataAddress.user_id = dataBody.;
    dataAddress.province_id = dataBody.province ;
    dataAddress.amphure_id = dataBody.amphure ;
    dataAddress.district_id = dataBody.district ;
    dataAddress.road = dataBody.road;
    dataAddress.other = dataBody.other;
    dataAddress.name_address = dataBody.name_address;
    dataAddress.lat = dataBody.lat ;
    dataAddress.lon = dataBody.lon ;


    let resData = {
        status : "",
        data : ""
    }   
    
    let checkParameter = await funCheckParameterWithOutId(dataUser);
    let checkParameter2 = await funCheckParameterWithOutId(dataAddress);
    if(checkParameter != "" || checkParameter2 != "")
    {
        //console.log(checkParameter)
        if(checkParameter != "") {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter +" )";    
            res.status(400).json(resData);
        }
        else {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter2 +" )";    
            res.status(400).json(resData);
        }
        
        
    }
    else
    {
       
       
        dataUser.password = await bcrypt.hash(dataBody.password , parseInt(saltRounds));

        let sql = `INSERT INTO "public"."tb_user"("name", "password", "idCard", "email", "phone", "createDate", "modifyDate") 
                   VALUES ('${dataUser.name}', '${dataUser.password}', '${dataUser.idCard}', '${dataUser.email}', '${dataUser.phone}'
                   , '${dataUser.createDate}', '${dataUser.modifyDate}') RETURNING *`;
        // console.log(sql)
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error tb_user: " + err;
                    res.status(400).json(resData);
                }
                else
                {
                    sql = `INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id",
                        "road", "other", "name_address", "latitude", "longitude") 
                        VALUES (${result.rows[0].id}, ${dataAddress.province_id}, ${dataAddress.amphure_id},
                        '${dataAddress.district_id}', '${dataAddress.road}', '${dataAddress.other}',
                        '${dataAddress.name_address}', '${dataAddress.lat}', '${dataAddress.lon}') 
                        RETURNING *`;                   
                              
                    pool.query(
                        sql, 
                        (err, result) => {
                            //console.log(err)
                            if (err) {
                                resData.status = "error";
                                resData.data = "query command error tb_address_user: " + err;
                                res.status(400).json(resData);
                            }
                            else
                            {      
                                resData.status = "success";
                                resData.data = "insert complete";
                                res.status(200).json(resData);
                            }
                        }
                    );
                }
            }
        );
    }

};

editUserProfile = (req , res , next) =>{

};

registerRider = async (req , res , next) =>{
    let dataBody = req.body ;
    let dataUser = new User();
    let dataAddress = new Position();
    dataUser.name= dataBody.name ;
    dataUser.password = dataBody.password ;
    dataUser.idCard = dataBody.idCard ;
    dataUser.email = dataBody.email;
    dataUser.phone = dataBody.phone;         
    dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');

    // dataAddress.user_id = dataBody.;
    dataAddress.province_id = dataBody.province ;
    dataAddress.amphure_id = dataBody.amphure ;
    dataAddress.district_id = dataBody.district ;
    dataAddress.road = dataBody.road;
    dataAddress.other = dataBody.other;
    dataAddress.name_address = dataBody.name_address;
    dataAddress.lat = dataBody.lat ;
    dataAddress.lon = dataBody.lon ;

    dataAddress

    let resData = {
        status : "",
        data : ""
    }   
    
    let checkParameter = await funCheckParameterWithOutId(dataUser);
    let checkParameter2 = await funCheckParameterWithOutId(dataAddress);
    if(checkParameter != "" || checkParameter2 != "")
    {
        //console.log(checkParameter)
        if(checkParameter != "") {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter +" )";    
            res.status(400).json(resData);
        }
        else {
            resData.status = "error";
            resData.data = "not have parameter ( "+ checkParameter2 +" )";    
            res.status(400).json(resData);
        }
        
        
    }
    else
    {
       
       
        dataUser.password = await bcrypt.hash(dataBody.password , parseInt(saltRounds));

        let sql = `INSERT INTO "public"."tb_user"("name", "password", "idCard", "email", "phone", "createDate", "modifyDate") 
                   VALUES ('${dataUser.name}', '${dataUser.password}', '${dataUser.idCard}', '${dataUser.email}', '${dataUser.phone}'
                   , '${dataUser.createDate}', '${dataUser.modifyDate}') RETURNING *`;
        // console.log(sql)
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error tb_user: " + err;
                    res.status(400).json(resData);
                }
                else
                {
                    sql = `INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id",
                        "road", "other", "name_address", "latitude", "longitude") 
                        VALUES (${result.rows[0].id}, ${dataAddress.province_id}, ${dataAddress.amphure_id},
                        '${dataAddress.district_id}', '${dataAddress.road}', '${dataAddress.other}',
                        '${dataAddress.name_address}', '${dataAddress.lat}', '${dataAddress.lon}') 
                        RETURNING *`;                   
                              
                    pool.query(
                        sql, 
                        (err, result) => {
                            //console.log(err)
                            if (err) {
                                resData.status = "error";
                                resData.data = "query command error tb_address_user: " + err;
                                res.status(400).json(resData);
                            }
                            else
                            {      
                                resData.status = "success";
                                resData.data = "insert complete";
                                res.status(200).json(resData);
                            }
                        }
                    );
                }
            }
        );
    }
    
};

editRiderProfile = (req , res , next) =>{

};

addUserAddress = async (req , res , next) => {
    let dataBody = req.body ; 
    let dataAddress = new PositionUserId();

    dataAddress.user_id = dataBody.user_id;
    dataAddress.province_id = dataBody.province ;
    dataAddress.amphure_id = dataBody.amphure ;
    dataAddress.district_id = dataBody.district ;
    dataAddress.road = dataBody.road;
    dataAddress.other = dataBody.other;
    dataAddress.name_address = dataBody.name_address;
    dataAddress.lat = dataBody.lat ;
    dataAddress.lon = dataBody.lon ;
    let checkParameter = await funCheckParameterWithOutId(dataAddress);
    let resData = {
        status : "",
        data : ""
    }   
    if(checkParameter != "" )
    {
        //console.log(checkParameter)
       
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(400).json(resData);
    }
    else
    {
        sql = `INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id",
                            "road", "other", "name_address", "latitude", "longitude") 
                            VALUES (${dataAddress.user_id}, ${dataAddress.province_id}, ${dataAddress.amphure_id},
                            '${dataAddress.district_id}', '${dataAddress.road}', '${dataAddress.other}',
                            '${dataAddress.name_address}', '${dataAddress.lat}', '${dataAddress.lon}') 
                            RETURNING *`;                   
                                
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    resData.status = "error";
                    resData.data = "query command error tb_address_user: " + err;
                    res.status(400).json(resData);
                }
                else
                {      
                    resData.status = "success";
                    resData.data = "insert complete";
                    res.status(200).json(resData);
                }
            }
        );
    }


};

editUserAddress = async (req , res , next) =>{
    let dataBody = req.body ;
    let dataAddress = new Position();

    dataAddress.id = dataBody.addressID ;
    dataAddress.province_id = dataBody.province ;
    dataAddress.amphure_id = dataBody.amphure ;
    dataAddress.district_id = dataBody.district ;
    dataAddress.road = dataBody.road;
    dataAddress.other = dataBody.other;
    dataAddress.name_address = dataBody.name_address;
    dataAddress.lat = dataBody.lat ;
    dataAddress.lon = dataBody.lon ;

    let checkParameter = await funCheckParameter(dataAddress);
    let resData = {
        status : "",
        data : ""
    }   
    if(checkParameter != "" )
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(400).json(resData);
    }
    else
    {
        let sql = `UPDATE "public"."tb_address_user" SET 
        "province_id" = ${ dataAddress.province_id}, "amphure_id" = ${dataAddress.amphure_id} ,
        "district_id" = '${dataAddress.district_id}', "road" = '${dataAddress.road}',
        "other" = '${dataAddress.other}', "name_address" = '${dataAddress.name_address}',
        "latitude" = '${dataAddress.lat}', "longitude" = '${dataAddress.lon}' WHERE "id" = ${dataAddress.id }`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : err
                    }   
                    res.status(400).json(data)
                }
                else
                {
                    let data = {
                        status : "success",
                        data : "update complete"
                    }
                    res.status(200).json(data);
                }
            }
        );

    }
    
};

deleteUserAddress = async (req , res , next) =>{
    //DELETE FROM "public"."tb_address_user" WHERE "id" = 6
    
    let addressID = req.body.addressID ;
   
    if(addressID == "" || addressID == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.data = "not have parameter ( addressID )";    
        res.status(400).json(resData);
    }
    else
    {
        let sql = `DELETE FROM "public"."tb_address_user" WHERE "id" = ${addressID}`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : err
                    }   
                    res.status(400).json(data)
                }
                else
                {
                    let data = {
                        status : "success",
                        data : "delete complete"
                    }
                    res.status(200).json(data);
                }
            }
        );
    }
};

//#endregion


 




//#endregion


module.exports = {
   registerIoT
}; 