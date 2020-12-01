const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { BankDriver ,BankDriverData,PositionDriver} = require("../model/driverModel");
const moment = require('moment');
const bcrypt = require('bcrypt'); 


//# Bank
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
                    AND "isDelete" = 0`;
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
                                    //console.log(sql)
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
                                    //console.log(result.rows[0].id)
                                    //INSERT INTO "public"."tb_bank_driver_manage"("bank_driver_id", "balance", "balance2", "modifydate") VALUES (1, 10.44, 10.44, '2020-11-24 14:52:58') RETURNING *
                                    sql = `INSERT INTO "public"."tb_bank_driver_manage"("bank_driver_id", "balance", 
                                     "modifydate") 
                                    VALUES (${result.rows[0].id}, 0, '${dataBank.modidyDate}') RETURNING *`;
                                    pool.query(
                                        sql, 
                                        (err, result) => {
                                
                                            if (err) {
                                                //console.log(err);  
                                                resData.status = "error";
                                                resData.statusCode = 200 ;
                                                resData.data =  err;    
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

// manage amount 


//#endregion 


module.exports = {
    addDriverBank,
    editDriverBank,
    deleteDriverBank ,
    getDriverBankByDriverId,
    getDriverBankById,
};