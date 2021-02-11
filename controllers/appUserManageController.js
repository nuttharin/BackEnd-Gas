const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider , Order , UserData} = require("../model/userModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');
const { generateToken , generateRefreshToken} = require('../controllers/appTokenManageController');


const { Double } = require("mongodb");
const moment = require('moment');
const bcrypt = require('bcrypt'); 



saltRounds = process.env.SALTROUND_SECRET ;

const multer = require('multer');
const storage = multer.diskStorage({
    destination : "./upload/picture/register",
    filename : (req,file,cb) =>{
        return cb(null,`${Date.now()}_picIdCard.${file.mimetype.split('/')[1]}`);
    } 
}); 

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1000000
    }
}).fields([{ name : 'picIdCard' } , {name : 'picIdCardFace'}]);


const storageProfile = multer.diskStorage({
    destination : "./upload/picture/profile",
    filename : (req,file,cb) =>{ 
        //console.log(file.mimetype.split('/')[1])
        return cb(null,`${Date.now()}_picProfile.${file.mimetype.split('/')[1]}`);
    }
}); 
const uploadPicProfile = multer({
    storage : storageProfile ,
    limits : {
        fileSize : 1000000
    }
}).fields([{ name : 'picProfile' }]);

//#region GET









//#endregion


//#region POST


// SELECT tb_user.name from tb_user
// LEFT JOIN tb_address_user on tb_address_user.user_id = tb_user.id
// LEFT JOIN tb_province on tb_province.id = tb_address_user.province_id
// LEFT JOIN tb_amphure on tb_amphure.id = tb_address_user.amphure_id
// LEFT JOIN tb_district on tb_district.id = tb_address_user.district_id

// SELECT tb_user.id , tb_user.name , tb_user.email , tb_user.phone from tb_user
// LEFT JOIN tb_address_user on tb_address_user.user_id = tb_user.id
// LEFT JOIN tb_province on tb_province.id = tb_address_user.province_id
// LEFT JOIN tb_amphure on tb_amphure.id = tb_address_user.amphure_id
// LEFT JOIN tb_district on tb_district.id = tb_address_user.district_id
// WHERE tb_user.id = 1

// User
getUserDetailById = (req ,res ,next) =>{

    let userID = req.query.user_id ;

    // let sql = `SELECT tb_user.id , tb_user.name , tb_user.email , 
    // tb_user.phone from tb_user
    // LEFT JOIN tb_address_user on tb_address_user.user_id = tb_user.id
    // LEFT JOIN tb_province on tb_province.id = tb_address_user.province_id
    // LEFT JOIN tb_amphure on tb_amphure.id = tb_address_user.amphure_id
    // LEFT JOIN tb_district on tb_district.id = tb_address_user.district_id
    // WHERE tb_user.id = ${userID}`;
    let sql = `SELECT tb_user.id , tb_user.name , tb_user.email , 
            tb_user.phone from tb_user
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

userLogin = async (req , res , next) =>{ 

    let dataBody = req.body ;
    let dataLogin = {
        user : dataBody.username,
        pwd : dataBody.password
    }
    // console.log(dataLogin)
    let resData = {
        status : "",
        statusCode : 200,
        data : ""
    }     

    let sql = `SELECT * FROM tb_user
                WHERE tb_user.email = '${dataLogin.user}'
                AND tb_user."isDelete" = 0 
                AND tb_user."isApproved" = 1`;
    pool.query(
        sql, 
        async (err, result) => {

            if (err) {
                //console.log(err);  
                resData.status = "error";
                resData.statusCode = 200 ;
                resData.data = err;
                res.status(400).json(resData);
            }
            else
            {                
                if(result.rows.length > 0)
                {
                    let match = await bcrypt.compare(dataBody.password, result.rows[0].password);
                    if(match) 
                    {
                        //console.log(result.rows)
                        dataUser = result.rows[0];
                        delete dataUser.password ;
                        let dataGen = {
                            username :dataUser.email ,
                            id : dataUser.id
                        }
                        let accessToken = await generateToken(dataGen);
                        let refreshToken = await generateRefreshToken(dataGen);

                        resData.status = "success";
                        resData.statusCode = 201 ;
                        resData.data = {
                            user_data : dataUser ,
                            token : {
                                accessToken : accessToken,
                                refreshToken : refreshToken
                            }
                        } ;
                        res.status(200).json(resData);
                    }
                    else{
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = [];
                        res.status(200).json(resData);
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
};

registerUser = async (req , res , next) =>{ 
    //console.log(req.body);
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    };
    // let dataToken = {
    //     username : 1000 ,
    //     id : 10
    // };
    // let token = await generateToken(dataToken);
    // console.log(token);
    
    upload(req, res,async function (err) {
        // console.log(req.files.picIdCard);
        // console.log(req.files.picIdCardFace);
        let pathUpload =  process.env.IP_ADDRESS+'/pictureRegisterUser/'
        console.log(req.files)
        let pathUploadPic = {
            cardId : pathUpload + req.files.picIdCard[0].filename,
            cardIdFace : pathUpload + req.files.picIdCardFace[0].filename
        };
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "A Multer error occurred when uploading.";
            res.status(201).json(resData);

        }
        else if (err) 
        {
          // An unknown error occurred when uploading.
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "An unknown error occurred when uploading.";
            res.status(201).json(resData);
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
                let sql = `SELECT * FROM tb_user
                            WHERE tb_user.email = '${dataUser.email}'`;
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
                            //console.log(result.rows)
                            if(result.rows.length > 0){
                                resData.status = "error";
                                resData.statusCode = 200 ;
                                resData.data = "Duplicate username";
                                res.status(200).json(resData);
                            }
                            else
                            {
                                dataUser.password = await bcrypt.hash(dataBody.password , parseInt(saltRounds));

                                sql = `INSERT INTO "public"."tb_user"("name", "password", "idCard", "email", "phone",
                                            "createDate", "modifyDate" ,"type" , "isDelete" , "urlPicture") 
                                        VALUES ('${dataUser.name}', '${dataUser.password}', '${dataUser.idCard}', '${dataUser.email}', '${dataUser.phone}'
                                        , '${dataUser.createDate}', '${dataUser.modifyDate}','${dataUser.type}' , 0 , '${JSON.stringify(pathUploadPic)}') RETURNING *`;
                                // console.log(sql)
                                pool.query(
                                    sql, 
                                    async (err, result) => 
                                    {
                                        //console.log(err)
                                        if (err) {
                                            //console.log(err);                      
                                            resData.status = "error";
                                            resData.statusCode = 200 ;

                                            resData.data = "query command error tb_user: " + err;
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

//UPDATE "public"."tb_user" SET "isApproved" = 1 WHERE "id" = 16
ApprovedUser =(req ,res,next) => {
    let data = req.body.user_id ;
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( user_id )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `UPDATE "public"."tb_user" SET "isApproved" = 1 WHERE "id" = ${user_id}`;
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
                    resData.data = "update complete" ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

editUserByUserId = async (req , res , next) =>{
    //UPDATE "public"."tb_user" SET "name" = 'x', "email" = 'x', "phone" = 'x' WHERE "id" = 16
    let dataUser = new UserData;
    let dataBody = req.body;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }     
    dataUser.id = dataBody.user_id;
    dataUser.name = dataBody.name ;
    dataUser.email = dataBody.email ;
    dataUser.phone = dataBody.phone ;    
    dataUser.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let checkParameter = await funCheckParameter(dataUser);


    if(checkParameter != "" ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_user" SET "name" = '${dataUser.name}',
                     "email" = '${dataUser.email}', "phone" = '${dataUser.phone}' ,
                    "modifyDate" = '${dataUser.modifyDate}'
                    WHERE "id" = ${dataUser.id}`;
        pool.query(
            sql, 
            (err, result) => {
    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error update tb_user : " + err;    
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

editUserPicProfileByUserId = async (req , res , next) =>{
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    uploadPicProfile(req, res,async function (err) {
        //console.log(req.files);
        console.log(req.body.user_id)
        let pathUpload =  process.env.IP_ADDRESS+'/pictureProfile/'
        let pathUploadPic = {
            profile : pathUpload + req.files.picProfile[0].filename
        };
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "A Multer error occurred when uploading.";
            res.status(201).json(resData);

        }
        else if (err) 
        {
          // An unknown error occurred when uploading.
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "An unknown error occurred when uploading.";
            res.status(201).json(resData);
        }
        else {
            //console.log()
            //UPDATE "public"."tb_user" SET "urlPicture" = 'x' WHERE "id" = 27
            let sql = `UPDATE "public"."tb_user" SET "urlPictureProfile" = '${pathUploadPic.profile}' WHERE "id" = ${req.body.user_id}`;
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
                        resData.data = "query command error tb_user: " + err;
                        res.status(400).json(resData);
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
    });
}

deleteUserByUserId = async (req , res , next) =>{
    //UPDATE "public"."tb_user" SET "isDelete" = 1 WHERE "id" = 16
    let user_id = req.body.user_id ;
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
        resData.data = "not have parameter ( user_id )";    
        res.status(200).json(resData);
    }
    else{       
        let sql = `UPDATE "public"."tb_user" SET "isDelete" = 1 WHERE "id" = ${user_id}`;
        pool.query(
            sql, 
            (err, result) => {    
                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error delete tb_user : " + err;    
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




//#region  user Address

// User Address
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
        statusCode : 200,
        data : ""
    }   
    if(checkParameter != "" )
    {
        //console.log(checkParameter)
       
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }
    else
    {
        //INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id", "road", "other", "name_address", "latitude", "longitude") VALUES (21, 1, 1, 1, 'xxx', 'xxx', 'xxx-xxx', '10.111', '10.222') RETURNING *
        sql = `INSERT INTO "public"."tb_address_user"("user_id", "province_id", "amphure_id", "district_id",
                            "road", "other", "name_address", "latitude", "longitude") 
                            VALUES (${dataAddress.user_id}, ${dataAddress.province_id}, ${dataAddress.amphure_id},
                            ${dataAddress.district_id}, '${dataAddress.road}', '${dataAddress.other}',
                            '${dataAddress.name_address}', '${dataAddress.lat}', '${dataAddress.lon}') 
                            RETURNING *`;                   
                                
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    resData.status = "error";
                    resData.data = "query command error tb_address_user: " + err;
                    res.status(200).json(resData);
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


};

editUserAddress = async (req , res , next) =>{
    let dataBody = req.body ;
    let dataAddress = new Position();

    dataAddress.id = dataBody.address_id ;
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
        let sql = `UPDATE "public"."tb_address_user" SET 
        "province_id" = ${ dataAddress.province_id}, "amphure_id" = ${dataAddress.amphure_id} ,
        "district_id" = ${dataAddress.district_id}, "road" = '${dataAddress.road}',
        "other" = '${dataAddress.other}', "name_address" = '${dataAddress.name_address}',
        "latitude" = '${dataAddress.lat}', "longitude" = '${dataAddress.lon}' WHERE "id" = ${dataAddress.id }`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                  
                    resData.status = "error" ;
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(200).json(resData);
                }
                else
                {
                    
                    resData.status = "success" ;
                    resData.statusCode = 201 ;
                    resData.data = "update complete" ;
                    res.status(201).json(resData);
                }
            }
        );

    }
    
};

deleteUserAddress = async (req , res , next) =>{
    //DELETE FROM "public"."tb_address_user" WHERE "id" = 6
    
    let addressID = req.body.address_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    if(addressID == "" || addressID == null ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( addressID )";    
        res.status(200).json(resData);
    }
    else
    {
        let sql = `DELETE FROM "public"."tb_address_user" WHERE "id" = ${addressID}`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    resData.status = "error" ;
                    resData.statusCode = 200 ;
                    resData.data = err ;
                    res.status(200).json(resData);
                }
                else
                {
                  

                    resData.status = "success" ;
                    resData.statusCode = 201 ;
                    resData.data = "delete complete" ;
                    res.status(201).json(resData);
                }
            }
        );
    }
};

getUserAddressByUserId = (req ,res ,next) =>{
    let userID = req.query.user_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    let sql = `SELECT tbAdd."id",tbADD.name_address,
            tbAdd.province_id , tbAdd.amphure_id , tbAdd.district_id,
            tbAdd.road , tbAdd.other , tbAdd.latitude, tbAdd.longitude,
            tbP.name_th as province, tbA.name_th as amphure, tbD.name_th as district
            
            FROM tb_address_user as tbAdd
            LEFT JOIN tb_provinces as tbP on tbP.id = tbAdd.province_id
            LEFT JOIN tb_districts as tbA on tbA.id = tbAdd.amphure_id
            LEFT JOIN tb_subdistricts as tbD on tbD.id = tbAdd.district_id
            WHERE  tbAdd.user_id = ${userID}`;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                resData.status = "error";
                resData.statusCode = 200 ;
                resData.data = "query command error";
                res.status(200).json(resData);
            }
            else
            {        
                resData.status = "success";
                resData.data = result.rows;
                resData.statusCode = 201;
                // console.log(result.rows[0].id)
                res.status(201).json(resData);
            }
        }
    );
};

getUserAddressByAddressId = (req ,res ,next) =>{
    let addressID = req.query.address_id ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    }   
    let sql = `SELECT tbAdd."id",tbADD.name_address,
                tbAdd.province_id , tbAdd.amphure_id , tbAdd.district_id,
                tbAdd.road , tbAdd.other , tbAdd.latitude, tbAdd.longitude,
                tbP.name_th as province, tbA.name_th as amphure, tbD.name_th as district
                
                FROM tb_address_user as tbAdd
                LEFT JOIN tb_provinces as tbP on tbP.id = tbAdd.province_id
                LEFT JOIN tb_districts as tbA on tbA.id = tbAdd.amphure_id
                LEFT JOIN tb_subdistricts as tbD on tbD.id = tbAdd.district_id
                WHERE tbAdd.id  = ${addressID}`;
    pool.query(
        sql, 
        (err, result) => {
            //console.log(err)
            if (err) {
                resData.status = "error";
                resData.statusCode = 200 ;
                resData.data = "query command error";
                res.status(200).json(resData);
            }
            else
            {        
                resData.status = "success";
                resData.statusCode = 201 ;
                resData.data = result.rows;
                // console.log(result.rows[0].id)
                res.status(201).json(resData);
            }
        }
    );
};


//#endregion

funAddUserAddress = async () =>{

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
                return false;
            }
            else
            {      
                return true;
            }
        }
    );
}



 




//#endregion


module.exports = {
    getUserDetailById,
    getUserAddressByUserId,
    getUserAddressByAddressId,
    registerUser,
    editUserByUserId,
    deleteUserByUserId,
    addUserAddress,
    editUserAddress,
    deleteUserAddress,
    userLogin,
    editUserPicProfileByUserId
}; 