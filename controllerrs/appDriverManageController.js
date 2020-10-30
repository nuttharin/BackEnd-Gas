const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider , Order , UserData} = require("../model/userModel");
const { BankDriver ,BankDriverData} = require("../model/driverModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');


const { Double } = require("mongodb");
const moment = require('moment');
const bcrypt = require('bcrypt'); 



saltRounds = process.env.SALTROUND_SECRET ;

//===== Set Path Picture =====//

const multer = require('multer');
const { json } = require("body-parser");
const storage = multer.diskStorage({
    destination : "./upload/picture/register_driver",
    filename : (req,file,cb) =>{
        return cb(null,`${Date.now()}_${file.originalname}`);
        //return cb(null,`${Date.now()}_${file.originalname}`);
    } 

}); 

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1000000
    }
})
.fields([
    { name : 'picIdCard' } , 
    { name : 'picIdCardFace'}
]);

//===== End Set Path Picture =====//


//#region GET

getRiderDetailById = (req ,res ,next) =>{

    let userID = req.query.user_id ;

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
};







//#endregion





//#region POST
// Driver 
getDriverProfileById = async (req , res,next) =>{
    let data = req.query.driver_id
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driver_id )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `SELECT id,name,email,phone FROM "public"."tb_rider"
                    WHERE id = ${data} `;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {    
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

driverLogin = async (req , res,next) =>{
    let dataBody = req.body ;
    let dataLogin = {
        user : dataBody.username,
        pwd : dataBody.password
    }
    console.log(dataLogin)
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }     

    let sql = `SELECT * FROM tb_rider
                WHERE tb_rider.email = '${dataLogin.user}'
                AND tb_rider."isDelete" = 0 `;
                console.log(sql)
    pool.query(
        sql, 
        async (err, result) => {
            //console.log(result)
            if (err) {
                //console.log(err);  
                resData.status = "error";
                resData.data = err;
                res.status(resData.statusCode).json(resData);
            }
            else
            {
                
                if(result.rows.length > 0)
                {
                    let match = await bcrypt.compare(dataBody.password, result.rows[0].password);
                    if(match) 
                    {
                        console.log(result.rows)
                        resData.status = "success";
                        resData.statusCode = 201 ;
                        resData.data = result.rows ;
                        res.status(resData.statusCode).json(resData);
                    }
                    else{
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = [];
                        res.status(resData.statusCode).json(resData);
                    }
                }
                else{
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "not have username";
                    res.status(resData.statusCode).json(resData);
                }
               
            }
        }
    );
}

registerRider = async (req , res , next) => {
    upload(req, res,async function (err) {
        // /upload/picture/register_driver
        let pathUpload =  process.env.IP_ADDRESS+'/pictureRegisterDriver/'
        let pathUploadPic = {
            cardId : pathUpload + req.files.picIdCard[0].filename,
            cardIdFace : pathUpload + req.files.picIdCardFace[0].filename
        }
        
       
        //console.log(req.files);
        // console.log(pathUpload + req.files.picIdCard[0].filename);
        // console.log(pathUpload + req.files.picIdCardFace[0].filename);

        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
        }
        else if (err) 
        {
          // An unknown error occurred when uploading.
        }
        else {
        
            let dataBody = req.body ;
            let dataUser = new User();
            //let dataAddress = new Position();
            dataUser.name= dataBody.name ;
            dataUser.password = dataBody.password ;
            dataUser.idCard = dataBody.idCard ;
            dataUser.email = dataBody.email;
            dataUser.phone = dataBody.phone;         
            dataUser.type = dataBody.type;
            dataUser.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
            dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');           


            let checkParameter = await funCheckParameterWithOutId(dataUser);
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
                let sql = `SELECT * FROM tb_rider
                            WHERE tb_rider.email = '${dataUser.email}'`;
                pool.query(
                    sql, 
                    async (err, result) => {
                        //console.log(err)
                        if (err) {
                            resData.status = "error";
                            resData.statusCode = 200 ;
                            resData.data = "query command error : " +err;
                            res.status(200).json(resData);
                        }
                        else
                        {
                            console.log(result.rows)
                            if(result.rows.length > 0){
                                resData.status = "error";
                                resData.statusCode = 200 ;
                                resData.data = "Duplicate username";
                                res.status(200).json(resData);
                            }
                            else
                            {
                                dataUser.password = await bcrypt.hash(dataBody.password , parseInt(saltRounds));
                                ///pictureRegisterUser/1603179432347_userID_.jpg
                                sql = `INSERT INTO "public"."tb_rider"("name", "password", "idCard", "email", "phone",
                                            "createDate", "modifyDate" , "isDelete", "urlPicture" ) 
                                        VALUES ('${dataUser.name}', '${dataUser.password}', '${dataUser.idCard}', '${dataUser.email}', '${dataUser.phone}'
                                        , '${dataUser.createDate}', '${dataUser.modifyDate}' , 0 , '${JSON.stringify(pathUploadPic)}') RETURNING *`;
                                // console.log(sql)
                                pool.query(
                                    sql, 
                                    (err, result) => 
                                    {
                                        //console.log(err)
                                        if (err) {
                                            //console.log(err);                      
                                            resData.status = "error";
                                            resData.statusCode = 200 ;

                                            resData.data = "query command error tb_rider: " + err;
                                            res.status(400).json(resData);
                                        }
                                        else
                                        {
                                            resData.status = "success";
                                            resData.statusCode = 201 ;
                                            resData.data = "insert complete";
                                            res.status(201).json(resData);
                                            
                                        }
                                    }
                                );
                            }  
                        }
                    }
                );  
                
            }
        }
    });
    
};

editRiderByRiderId = async (req , res , next) =>{
    //UPDATE "public"."tb_user" SET "name" = 'x', "email" = 'x', "phone" = 'x' WHERE "id" = 16
    let dataUser = new UserData;
    let dataBody = req.body;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }     
    dataUser.id = dataBody.driver_id;
    dataUser.name = dataBody.name ;
    dataUser.email = dataBody.email ;
    dataUser.phone = dataBody.phone ;    
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let checkParameter = await funCheckParameter(dataUser);
    console.log(dataUser)
    if(checkParameter != "" ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_rider" SET "name" = '${dataUser.name}',
                     "email" = '${dataUser.email}', "phone" = '${dataUser.phone}' 
                    WHERE "id" = ${dataUser.id}`;
        pool.query(
            sql, 
            (err, result) => {    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error update tb_rider : " + err;    
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
};

deleteRiderByRiderId = async (req , res , next) =>{
    //UPDATE "public"."tb_user" SET "isDelete" = 1 WHERE "id" = 16
    let user_id = req.body.driver_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }     
    if(user_id == "" || user_id == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driver_id )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_rider" SET "isDelete" = 1 WHERE "id" = ${user_id}`;
        pool.query(
            sql, 
            (err, result) => {    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error delete tb_rider : " + err;    
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
};








// Bank
getDriverBankByDriverId = async (req ,res ,next) =>{
    let data = req.query.driver_id
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driver_id )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `SELECT tb_bank_driver.id as driverBank_id ,tb_bank_detail."name",
                    tb_bank_detail.swiftcode,bank_id,driver_id,bank_name,bank_account 
                    FROM "public"."tb_bank_driver" 
                    INNER JOIN tb_bank_detail ON tb_bank_detail."id" = tb_bank_driver.bank_id
                    WHERE  driver_id = ${data}  AND "isDelete" = 0`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {    
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

getDriverBankById = (req,res,next) =>{
    let data = req.query.driverBank_id
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driverBank_id )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `SELECT tb_bank_driver.id as driverBank_id ,tb_bank_detail."name",
                    tb_bank_detail.swiftcode,bank_id,driver_id,bank_name,bank_account 
                    FROM "public"."tb_bank_driver" 
                    INNER JOIN tb_bank_detail ON tb_bank_detail."id" = tb_bank_driver.bank_id 
                    WHERE  tb_bank_driver.id = ${data} AND "isDelete" = 0`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {    
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    resData.data = result.rows ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

addDriverBank = async (req , res , next) => {
    //INSERT INTO "public"."tb_bank_driver"("driver_id", "bank_id", "bank_name", "bank_account", "createdate") VALUES (4, 3, 'ธารินทร์ ตันตะโยธิน', '1111-2222-3333-4444', '2020-10-29 11:25:26') RETURNING *
    let dataBank = new BankDriver();
    let dataBody = req.body ;
    //let dd = await x(dataBody.driver_id)
    //console.log(dd)
    dataBank.driver_id = dataBody.driver_id ;
    dataBank.bank_id = dataBody.bank_id ;
    dataBank.name_account = dataBody.name_account ;
    dataBank.bank_account = dataBody.bank_account;
    dataBank.modidyDate =  moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let checkParameter = await funCheckParameterWithOutId(dataBank);
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    } ;
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
        let sql = `SELECT id FROM "public"."tb_bank_driver" 
                    WHERE  bank_id = ${dataBank.bank_id}
                    AND  bank_account = '${ dataBank.bank_account}'
                    AND driver_id = ${dataBank.driver_id}
                    AND isDelete = 0`;
        pool.query(
            sql, 
            async (err, result) => {

                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    
                    resData.data = err ;
                    res.status(resData.statusCode).json(resData)
                }
                else
                {    
                    //console.log(result.rows)               
                    if(result.rows.length > 0)
                    {
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "Duplicate username";
                        res.status(200).json(resData);
                        
                    }
                    else{
                        sql = `INSERT INTO "public"."tb_bank_driver"("driver_id", "bank_id",
                                "bank_name", "bank_account", "modifyDate" , "isDelete") 
                                    VALUES (${dataBank.driver_id}, ${dataBank.bank_id}, '${dataBank.name_account}',
                                     '${dataBank.bank_account}', '${dataBank.modidyDate}' , 0) 
                                    RETURNING *`;
                        pool.query(
                            sql, 
                            (err, result) => {

                                if (err) {
                                    //console.log(err); 
                                    resData.status = "error"; 
                                    resData.statusCode = 200 ;
                                    resData.data = err ;
                                    res.status(resData.statusCode).json(resData)
                                }
                                else
                                {    
                                    resData.status = "success";
                                    resData.statusCode = 201 ;
                                    resData.data = "insert complete";
                                    res.status(201).json(resData);
                                }
                            }
                        );
                    } 
                   
                }
            }
        );
        
    }
}

editDriverBank = async (req ,res ,next)=> {

    //UPDATE "public"."tb_bank_driver" SET "bank_id" = 4, "bank_name" = 'ธารินทร์ ตันตะโยธินv', "bank_account" = '1111-2222-3333-4444v' WHERE "id" = 1
    let dataBank = new BankDriverData();
    let dataBody = req.body ;
    //let dd = await x(dataBody.driver_id)
    //console.log(dd)
    dataBank.id = dataBody.driverBank_id ;
    dataBank.bank_id = dataBody.bank_id ;
    dataBank.name_account = dataBody.name_account ;
    dataBank.bank_account = dataBody.bank_account;
    dataBank.modidyDate =  moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let checkParameter = await funCheckParameterWithOutId(dataBank);
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    } ;
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
        let sql = `UPDATE "public"."tb_bank_driver" 
                    SET "bank_id" = ${ dataBank.bank_id}, "bank_name" = '${dataBank.name_account}',
                    "bank_account" = '${dataBank.bank_account}' 
                    WHERE "id" = ${dataBank.id}`;
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

deleteDriverBank = async (req,res,next) =>{
    //UPDATE "public"."tb_bank_driver" SET "isDelete" = 1 WHERE "id" = 1
  
    let data = req.body.driverBank_id;   
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    } ;
    if(data == "" || data == null) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( driverBank_id )";    
        res.status(200).json(resData);
    }
    else
    {
        let sql = `UPDATE "public"."tb_bank_driver" SET "isDelete" = 1 WHERE "id" = ${data}`;
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
                    resData.data = "delete complete";    
                    res.status(201).json(resData);
                }
            }
        );
    }
}

//#endregion 

x = async (id) =>{
    let sql = `SELECT * FROM "public"."tb_bank_driver" 
                WHERE tb_bank_driver.driver_id = ${id}`;
    pool.query(
        sql, 
        async (err, result) => {

            if (err) {
                //console.log(err); 
                resData.status = "error"; 
                resData.statusCode = 200 ;
                resData.data = err ;
                res.status(resData.statusCode).json(resData)
            }
            else
            {    
               
                let data = await result.rows ; 
                //console.log(data)
                return data ;
            }
        }
    );
}

module.exports = {
    driverLogin,
    registerRider,
    getDriverProfileById,
    editRiderByRiderId ,
    deleteRiderByRiderId,
    addDriverBank,
    editDriverBank,
    deleteDriverBank ,
    getDriverBankByDriverId,
    getDriverBankById
    
}