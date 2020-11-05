const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider  , UserData} = require("../model/userModel");
const {CartData, Cart , Order} = require('../model/orderModel')
const {funCheckParameterWithOutId,funCheckBody} =  require('../function/function');
const moment = require('moment');
const { getOrderByRiderId } = require("./userController");



//Cart

getOrderInCartByUserId = (req,res,next) =>{
    let data = req.query.user_id
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
        let sql = `SELECT tb_order_cart."id" as cart_id , user_id , "name" as product , 
                    quality,price,(price*quality) as priceAll FROM tb_order_cart
                    INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_cart.gas_id
                    WHERE  user_id = ${data}`;
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

addOrderInCartByUserId = async (req,res,next) => {
//INSERT INTO "public"."tb_order_cart"("user_id", "gas_id", "quality", "modifyDate") VALUES (15, 4, 2, '2020-11-03 15:22:31') RETURNING *
    let dataBody = req.body ;
    let dataCart = new Cart() ;
    
    dataCart.quality = dataBody.quality ;
    dataCart.user_id = dataBody.user_id ;   
    dataCart.gas_id = dataBody.gas_id; 
    dataCart.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    

    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    let checkparameter = await funCheckParameterWithOutId(dataCart) ;
    //console.log(checkparameter)
    if(checkparameter != "" )
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkparameter +" )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `SELECT * FROM tb_order_cart
                    WHERE user_id = ${dataCart.user_id} AND gas_id = ${dataCart.gas_id}`;
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
                    console.log(result.rows)
                    if(result.rows.length > 0)
                    {                        
                        dataCart.quality = result.rows[0].quality + dataCart.quality
                        sql = await ` UPDATE "public"."tb_order_cart" 
                                    SET "quality" = ${dataCart.quality} ,
                                    "modifyDate" = '${dataCart.modifyDate}'
                                    WHERE "id" = ${result.rows[0].id}`; ;
                    }
                    else
                    {
                        sql = await ` INSERT INTO "public"."tb_order_cart"
                                        ("user_id", "gas_id", "quality","modifyDate") 
                                        VALUES (${dataCart.user_id}, ${dataCart.gas_id}, 
                                        ${dataCart.quality}, '${dataCart.modifyDate}') RETURNING *`;
                    }
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
                                resData.status = "success"; 
                                resData.statusCode = 201 ;
                                resData.data = "insert complete" ;
                                res.status(resData.statusCode).json(resData);
                            }
                        }
                    );
                }
            }
        );

       
    }
}
 
editOrderInCartById = async (req,res,next) => {
// UPDATE "public"."tb_order_cart" SET "quality" = 2 WHERE "id" = 3
    let dataBody = req.body ;
    let dataCart = new CartData() 
    
    dataCart.cart_id = dataBody.cart_id ;
    dataCart.quality = dataBody.quality ;
    dataCart.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');

    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    let checkparameter = await funCheckParameterWithOutId(dataCart) ;
    console.log(checkparameter)
    if(checkparameter != "" )
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkparameter +" )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = ` UPDATE "public"."tb_order_cart" 
                    SET "quality" = ${dataCart.quality} ,
                    "modifyDate" = '${dataCart.modifyDate}'
                    WHERE "id" = ${dataCart.cart_id}`;
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

deleteOrderInCartById = (req,res,next) =>{
    //DELETE FROM "public"."tb_order_cart" WHERE "id" = 3
    let data = req.body.cart_id
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( cart_id )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `DELETE FROM "public"."tb_order_cart" WHERE "id" = ${data}`;
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
                    resData.data = "delete complete" ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}

//Order
getOrderByUserId = async (req,res,next) =>{
    // SELECT * FROM tb_order
    // INNER JOIN tb_payment_channel ON tb_payment_channel."id" = tb_order.payment_id
    // INNER JOIN tb_order_status ON tb_order_status."id" = tb_order.status
    // INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
    // INNER JOIN tb_address_user ON tb_address_user."id" = tb_order.address_id
    
    let data = req.query.x
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkParameter +" )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = ``;
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

getOrderByOderId = async (req,res,next) =>{

}

addOrderUser = async (req,res,next) =>{
    
    //INSERT INTO "public"."tb_order_address"("province_id", "district_id", "subdistrict_id", "road", "other", "name_address", "lat", "lon") VALUES (1, 1, 1, 'xx', 'xx', 'xx', '10.2', '10.1') RETURNING *
    //INSERT INTO "public"."tb_order"("user_id", "priceall", "createDate", "modifyDate", "send_type", "payment_id", "order_number", "address_id", "status") VALUES (20, '111', '2020-11-04 16:53:06', '2020-11-04 16:53:10', 'send', 3, '0000000002', 1, 'noreceive') RETURNING *
    //INSERT INTO "public"."tb_order_detail"("order_id", "gas_id", "quality") VALUES (1, 3, 1) RETURNING *
    // [
    //     {gas_id : 3 , quality : 1}, {gas_id : 4 , quality : 2}
    // ]
    let dataBody = req.body ;
    let dataOrder = new Order() ;
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    //dataOrder.id
    dataOrder.user_id =  dataBody.user_id ;
    dataOrder.priceall = dataBody.priceall
    dataOrder.createDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    dataOrder.modifyDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss');    
    dataOrder.send_type = dataBody.send_type ;
    dataOrder.payment_id = dataBody.payment_id;
    dataOrder.order_number =  moment(new Date()).format('YYYYMMDDHmm');
    dataOrder.address_id = dataBody.address_id ;
    dataOrder.status = dataBody.status ;
    dataOrder.order = dataBody.order ;
    let checkparameter = await funCheckParameterWithOutId(dataOrder) ;
    //console.log(checkparameter);
    console.log(dataOrder);
    if(checkparameter != "" )
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( "+ checkparameter +" )";    
        res.status(200).json(resData);
    }   
    else
    {
        let sql = `INSERT INTO "public"."tb_order" ("user_id", "priceall", "createDate", 
        "modifyDate", "send_type", "payment_id", "order_number", "address_id", "status") 
        VALUES (${dataOrder.user_id}, '${dataOrder.priceall}', '${dataOrder.createDate}',
         '${dataOrder.modifyDate}', '${dataOrder.send_type}', ${dataOrder.payment_id}, 
         '${dataOrder.order_number}', ${dataOrder.address_id}, '${dataOrder.status}') RETURNING *`;
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
                    console.log(result.rows)                    
                    dataOrder.id = result.rows[0].id ;
                    let sqlAddress ;
                    sql = "";
                    for (let i = 0; i < dataOrder.order.length; i++) 
                    {
                        sql = await sql+`INSERT INTO "public"."tb_order_detail"("order_id", "gas_id", "quality") 
                        VALUES (${dataOrder.id}, ${dataOrder.order[i].gas_id}, ${dataOrder.order[i].quality}) ;` ;                       
                        
                    }
                    
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
        );
    }

    //res.json(dataOrder)
}

editOrderUser = (req,res,next) =>{
}

cancalOrderUser = (req,res,next) =>{
    //UPDATE "public"."tb_order" SET "status" = '1' WHERE "id" = 2
    let data = req.body.order_id ;
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( order_id )";    
        res.status(200).json(resData);
    }   
    else 
    {
        let sql = `UPDATE "public"."tb_order" SET "status" = '1' WHERE "id" = ${data}`;
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
                    resData.data = "delete complete";    
                    res.status(201).json(resData);
                }
            }
        );
    }
}


module.exports = {
    
    getOrderInCartByUserId,
    addOrderInCartByUserId,
    editOrderInCartById,
    deleteOrderInCartById,
    getOrderByUserId,
    addOrderUser,
    editOrderUser,
    cancalOrderUser
}