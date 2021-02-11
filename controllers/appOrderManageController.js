const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider  , UserData} = require("../model/userModel");
const {CartData, Cart , Order} = require('../model/orderModel');
const axios = require('axios');
const {
    funCheckParameterWithOutId
    ,funCalDistanceLatLon
    ,funCalDistanceLatLon2
    ,funRandomNumberString

} =  require('../function/function');
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
        let sql = `SELECT tb_order_cart."id" as cart_id , user_id , tb_gas_detail.id as gas_id 
                    , "name" as product , quality,price,(price*quality) as priceAll FROM tb_order_cart
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
getOrderHistoryAllByUserId = async (req,res,next) => {
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
        let arrOrder = {} ;
        let dataAll ;

        let sql = `SELECT  tb_order_detail.order_id , tb_order.order_number as order_number, sum((tb_order_detail.quality * tb_gas_detail.price)) as price_all,
        tb_order."modifyDate" as modify_date , tb_order_status."name" as status_order
        FROM tb_order
        INNER JOIN tb_order_status ON tb_order_status."id" = tb_order.status
        INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
        INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_detail.gas_id
        WHERE tb_order.user_id = ${data} AND tb_order.status <> 1
        GROUP BY order_number , modify_date , status_order , order_id 
        ORDER BY order_number `;
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
                    //console.log(result.rows[0]);
                    dataAll = await result.rows ;
                    sql = `SELECT  tb_order.order_number as order_number,tb_gas_detail."name" as gas_type ,tb_order_detail.quality ,
                            (tb_gas_detail.price) as price                  
                            FROM tb_order
                            INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
                            INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_detail.gas_id
                            WHERE tb_order.user_id = ${data} AND tb_order.status <> 1 ORDER BY order_number`;
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
                                //console.log(result.rows[0])
                                let temp ;
                                for (let i = 0; i < dataAll.length; i++) {
                                    dataAll[i].order_list = [] ;
                                   for (let j = 0; j < result.rows.length; j++) {
                                        if(dataAll[i].order_number == result.rows[j].order_number)
                                        {
                                            temp = result.rows[j] ;
                                            await dataAll[i].order_list.push(result.rows[j])
                                        }
                                   }                                    
                                }
                                //console.log(dataAll)
                                resData.status = "success"; 
                                resData.statusCode = 201 ;
                                resData.data = dataAll ;
                                res.status(resData.statusCode).json(resData);
                            }
                        }
                    );
                   
                }
            }
        ); 
    }
}

getOrderByUserId = async (req,res,next) =>{
    // SELECT * FROM tb_order
    // INNER JOIN tb_payment_channel ON tb_payment_channel."id" = tb_order.payment_id
    // INNER JOIN tb_order_status ON tb_order_status."id" = tb_order.status
    // INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
    // INNER JOIN tb_address_user ON tb_address_user."id" = tb_order.address_id
    
    let data = req.query.order_id
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
    else {
        let sql = `SELECT 
                    order_number , tb_order."createDate" as create_date,
                    tb_order."receiveDate" as receive_date,
                    tb_order."paymentDate" as payment_date,
                    tb_order."sendDate" as send_date,
                    tb_address_user.other as address_order,
                    tb_address_user.road as address_road,
                    tb_subdistricts.name_th as subdis_name,
                    tb_districts.name_th as dis_name,
                    tb_provinces.name_th as provice_name,
                    tb_address_user.name_address,
                    tb_rider."name" as driver_name,
                    tb_rider.phone as driver_phone,
                    tb_gas_detail."name" as gas_type,
                    tb_order_detail.quality as gas_quality,
                    (tb_order_detail.quality*tb_gas_detail.price) as gas_prices
                    FROM tb_order
                    INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
                    INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_detail.gas_id 
                    INNER JOIN tb_payment_channel ON tb_payment_channel."id" = tb_order.payment_id
                    INNER JOIN tb_order_status ON tb_order_status."id" = tb_order.status
                    INNER JOIN tb_address_user ON tb_address_user."id" = tb_order.address_id
                    INNER JOIN tb_provinces ON tb_provinces."id" = tb_address_user.province_id
                    INNER JOIN tb_districts ON tb_districts."id" = tb_address_user.amphure_id
                    INNER JOIN tb_subdistricts ON tb_subdistricts."id" = tb_address_user.district_id
                    INNER JOIN tb_rider ON tb_rider."id" = tb_order.rider_id
                    WHERE tb_order."id" = ${data}`;
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
                {   console.log(result.rows)
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
    let data = req.query.order_id
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
    else {
        let sql = `SELECT order_number , tb_order."createDate" as create_date,
                    tb_order."receiveDate" as receive_date,
                    tb_order."paymentDate" as payment_date,
                    tb_order."sendDate" as send_date,
                    tb_address_user.other as address_other,
                    tb_address_user.road as address_road,
                    tb_subdistricts.name_th as subdis_name,
                    tb_districts.name_th as dis_name,
                    tb_provinces.name_th as provice_name,
                    tb_subdistricts.zip_code as zip_code,
                    tb_address_user.name_address,
                    tb_rider."name" as driver_name,
                    tb_rider.phone as driver_phone,
                    tb_gas_detail."name" as gas_type,
                    tb_order_detail.quality as gas_quality,
                    tb_gas_detail.price as gas_price,
                    (tb_order_detail.quality*tb_gas_detail.price) as gas_price_all
                    FROM tb_order
                    INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
                    INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_detail.gas_id 
                    INNER JOIN tb_payment_channel ON tb_payment_channel."id" = tb_order.payment_id
                    INNER JOIN tb_order_status ON tb_order_status."id" = tb_order.status
                    INNER JOIN tb_address_user ON tb_address_user."id" = tb_order.address_id
                    INNER JOIN tb_provinces ON tb_provinces."id" = tb_address_user.province_id
                    INNER JOIN tb_districts ON tb_districts."id" = tb_address_user.amphure_id
                    INNER JOIN tb_subdistricts ON tb_subdistricts."id" = tb_address_user.district_id
                    INNER JOIN tb_rider ON tb_rider."id" = tb_order.rider_id
                    WHERE tb_order."id" = ${data}`;
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
                    let dataTemp = await result.rows ;
                    //delete dataTemp.create_date ;
                    dataTemp = dataTemp.map(x => ({
                        gas_type : x.gas_type,
                        prices : x.gas_price,
                        price_all : x.gas_price_all,
                        quality : x.gas_quality

                    }));
                    console.log(dataTemp)
                    console.log(result.rows[0].dis_name.substring(0,4) +"xx")
                    //result.rows[0].payment_date = await moment( result.rows[0].payment_date).format('YYYY-MM-DD H:mm:ss');
                    resData.status = "success"; 
                    resData.statusCode = 201 ;
                    resData.data = await {
                        order_number : result.rows[0].order_number,
                        create_date :  moment( result.rows[0].create_date).format('YYYY-MM-DD H:mm:ss'),
                        receive_date :  moment( result.rows[0].receive_date).format('YYYY-MM-DD H:mm:ss'),
                        payment_date :  moment( result.rows[0].payment_date).format('YYYY-MM-DD H:mm:ss'),
                        send_date :  moment( result.rows[0].send_date).format('YYYY-MM-DD H:mm:ss'),
                        driver_name : result.rows[0].driver_name,
                        driver_phone : result.rows[0].driver_phone,
                        address :  `${result.rows[0].name_address} ` +
                        `${result.rows[0].address_other} ${result.rows[0].address_road} ` +
                        `${(result.rows[0].dis_name.substring(0,4) == "เขต ")? "แขวง "+result.rows[0].subdis_name:"ต."+result.rows[0].subdis_name}`+
                        `${(result.rows[0].dis_name.substring(0,4) == "เขต ")? "เขต "+result.rows[0].dis_name:" อ."+ result.rows[0].dis_name}`+
                        ` จ. ${result.rows[0].provice_name } ${result.rows[0].zip_code }`,
                        name_address : result.rows[0].name_address,
                        address_other : result.rows[0].address_other,
                        address_road : result.rows[0].address_road,
                        district : result.rows[0].dis_name,
                        subdistrict :result.rows[0].subdis_name,
                        order_list : dataTemp,
                    } ;
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
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
    dataOrder.order = dataBody.order ;
    dataOrder.machine_id = dataBody.machine_id
    let checkparameter = await funCheckParameterWithOutId(dataOrder) ;
    //console.log(checkparameter);
    //console.log(dataOrder);
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
        "modifyDate", "send_type", "payment_id", "order_number", "address_id", "status" ,"machine_id") 
        VALUES (${dataOrder.user_id}, '${dataOrder.priceall}', '${dataOrder.createDate}',
         '${dataOrder.modifyDate}', '${dataOrder.send_type}', ${dataOrder.payment_id}, 
         '${dataOrder.order_number}', ${dataOrder.address_id}, 3 ,${dataOrder.machine_id}) RETURNING *`;
        
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
                        async (err, result) => {
            
                            if (err) {
                                //console.log(err); 
                                resData.status = "error"; 
                                resData.statusCode = 200 ;
                                resData.data = "error table tb_order_detail "+err ;
                                res.status(resData.statusCode).json(resData)
                            }
                            else
                            {    
                                let commanDel = `DELETE FROM "public"."tb_order_cart" WHERE user_id = ${dataOrder.user_id}` ;
                                let commandDelAll = "" ;
                                console.log(dataOrder.order)
                                for (let i = 0; i < dataOrder.order.length ; i++) {
                                    commandDelAll += await commanDel + "AND gas_id = "+dataOrder.order[i].gas_id ;
                                    if(i != dataOrder.order.length -1)
                                    {
                                        commandDelAll += await " ; "
                                    }                                    
                                }
                                // sql = `DELETE FROM "public"."tb_order_cart" ${commanDel}`
                                //console.log(commandDelAll)
                                pool.query(
                                    commandDelAll, 
                                    async (err, result) => {                        
                                        if (err) {
                                            //console.log(err); 
                                            resData.status = "error"; 
                                            resData.statusCode = 200 ;
                                            resData.data = "error table tb_cart " + err ;
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
    let newDate = moment(new Date()).format('YYYY-MM-DD H:mm:ss')
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
        let sql = `SELECT tb_order.id , tb_order.status FROM tb_order WHERE tb_order.id = ${data}`;
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
                   console.log(result.rows[0])
                   if(result.rows[0].status == 3 || result.rows[0].status == 6)
                   {
                        sql = `UPDATE "public"."tb_order" SET "modifyDate" = '${newDate}', "status" = '1' 
                        WHERE "id" = ${data}`;

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
                   else{

                        resData.status = "error"; 
                        resData.statusCode = 200 ;
                        resData.data = "ไม่สามารถลบได้เนื่องจาก Order ถูกรับไปแล้ว" ;
                        res.status(resData.statusCode).json(resData);
                    }
                }
            }
        );
    }
}

successOrderUser = () =>{
    //UPDATE "public"."tb_order" SET "status" = 4 WHERE "id" = 3
}

sendOrderToDriver = async (req,res,next) => {
    //13.860396, 100.513604
    //13.860674, 100.511575
    // meter
    // check ว่า rider มีงานค้างอยู่ไหม => ไม่ส่งเลย
    let distance = await funCalDistanceLatLon(13.860396, 100.513604,13.860674, 100.511575);
    let distance2 = await funCalDistanceLatLon2(13.860396, 100.513604,13.860674, 100.511575,"K");
    console.log(distance);
    console.log(distance2);


}

driverSendOrderSuccess = async (req, res,next) =>{
    let pwdMachine = await funRandomNumberString(6) ;
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
        //update status = 4 , pwdGasMachine , receiveDate
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
                    resData.data = "delete complete";    
                    res.status(201).json(resData);
                }
            }
        );
    }

}

getDriverOrderReviceByDriverId = async (req,res,next) => {   
    
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
    else 
    {
        let sql = ` SELECT 
                    tb_order.id as order_id
                    ,tb_order.rider_id as rider_id
                    ,tb_order.order_number as order_number 
                    ,tb_order."pwdGasMachine" as pwd_gas_station
                    ,tb_machine_gas.address_name as gas_station_name
                    ,tb_address_user.name_address as customer_address_name
                    ,tb_address_user.other as address_order
                    ,tb_address_user.road as address_road
                    , tb_subdistricts.name_th as subdistrict_name
                    ,tb_districts.name_th as district_name
                    ,tb_provinces.name_th as provice_name
                    ,tb_address_user.latitude as latitude_customer
                    ,tb_address_user.longitude as longitude_cusetomer
                    ,t1.lat as latitude_driver , t1.lon as longitude_driver 
                    FROM tb_order 
                    INNER JOIN tb_address_user ON tb_order.address_id = tb_address_user.id
                    INNER JOIN tb_machine_gas ON tb_machine_gas.id = tb_order.machine_id                 
                    INNER JOIN tb_provinces ON tb_provinces."id" = tb_address_user.province_id
                    INNER JOIN tb_districts ON tb_districts."id" = tb_address_user.amphure_id
                    INNER JOIN tb_subdistricts ON tb_subdistricts."id" = tb_address_user.district_id
                    INNER JOIN (SELECT tb_position_driver.rider_id,
                                            tb_position_driver.lat , tb_position_driver.lon 
                                            FROM tb_position_driver WHERE tb_position_driver.rider_id = 4 
                                            ORDER BY "createDate" DESC LIMIT 1) t1
                                            ON ( tb_order.rider_id = t1.rider_id )
                    WHERE tb_order.rider_id = ${data}   
                    AND tb_order.status = 2 ;`;

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
                    let dataOrder = result.rows[0];
                    sql = `SELECT  tb_order.order_number as order_number,tb_gas_detail."name" as gas_type ,tb_order_detail.quality ,
                            (tb_gas_detail.price) as price                  
                            FROM tb_order
                            INNER JOIN tb_order_detail ON tb_order_detail.order_id = tb_order."id"
                            INNER JOIN tb_gas_detail ON tb_gas_detail."id" = tb_order_detail.gas_id
                            WHERE tb_order.id = ${result.rows[0].order_id}`;
                    pool.query(
                        sql, 
                        (err, result) => {
            
                            if (err) {
                                resData.status = "error"; 
                                resData.statusCode = 200 ;
                                resData.data = err ;
                                res.status(resData.statusCode).json(resData)
                            }
                            else
                            {
                                //console.log(result.rows)
                                dataOrder.order_detail = result.rows ;
                                resData.status = "success"; 
                                resData.statusCode = 201 ;
                                resData.data = dataOrder ;
                                res.status(resData.statusCode).json(resData);
                            }
                        }
                    );
                }
            }
        );
    }
}

getOrderDriverReceiveNotCompleteByDriverId = async (req,res,next) =>{

}

driverReceiveOrder = async (req,res,next)=> {
    // check ว่า order นั้นมีคนรับหรือยัง
    //UPDATE "public"."tb_order" SET "status" = 2, "rider_id" = 1, "driverReceiveDate" = '2020-11-13 10:53:38' WHERE "id" = 2
    let dataBody = req.body ;
    dataBody.driverReceiveDate =  moment(new Date()).format('YYYY-MM-DD H:mm:ss');
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    } ;
    if(dataBody.driver_id == "" || dataBody.driver_id == undefined)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( order_id )";    
        res.status(200).json(resData);
    }
    else if(dataBody.order_id == "" || dataBody.order_id == undefined)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( order_id )";    
        res.status(200).json(resData);
    }
    else{   
        //
        let sql = `SELECT tb_order."id" FROM tb_order
                    WHERE tb_order."id" = ${dataBody.order_id} 
                    AND tb_order.status = 3 `;
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
                    // status = 2 คือมีคนรับงานแล้ว             
                   
                    if(result.rows.length > 0)
                    {
                        
                        let pwdMachine =  await funRandomNumberString(6) ;
                        let checkWhile ;
                        let dataPwd ;
                        sql = `SELECT id, DATE(tb_order."createDate") FROM tb_order
                        WHERE CURRENT_DATE = DATE(tb_order."createDate")`;
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
                                    dataPwd = await result.rows ;
                                    if(result.rows.length == 0)
                                    {
                                        checkWhile = await false ;
                                    }
                                    else
                                    {
                                        checkWhile = await dataPwd.includes(pwdMachine);
                                        while(checkWhile)
                                        {
                                            pwdMachine = await funRandomNumberString(6) ;
                                            checkWhile = await dataPwd.includes(pwdMachine);
                                        }
                                        //console.log(checkWhile)
                                    }
                                }
                            }
                        );
                      

                        sql = `UPDATE "public"."tb_order" SET "status" = 2, 
                                "rider_id" = ${dataBody.driver_id}, 
                                "driverReceiveDate" = '${dataBody.driverReceiveDate}' ,
                                "pwdGasMachine"  = '${pwdMachine}'
                                WHERE "id" = ${dataBody.order_id}`;

                        pool.query(
                            sql, 
                            (err, result) => 
                            {
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
                    else{
                        resData.status = "success";
                        resData.statusCode = 200 ;
                        resData.data ="order has been received" ;
                        res.status(resData.statusCode).json(resData);
                    }
                }
            }
        );
    }
}

// checkQrCodeMachineReceiveGas = (req , res , next) =>{
//     // check กับ machine_code 
//     let data = req.body ;
//     let resData = {
//         status : "",
//         statusCode : 200 ,
//         data : ""
//     }
//     if(data.qrcode == "" || data.qrcode == null)
//     {
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( qrcode )";    
//         res.status(200).json(resData);
//     }   
//     else if(data.driver_id == "" || data.driver_id == null)
//     {
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( driver_id )";    
//         res.status(200).json(resData);
//     } 
//     else 
//     {
//         let sql = `SELECT tb_order.id FROM tb_order
//         INNER JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
//         WHERE tb_order.rider_id = ${data.driver_id} AND tb_machine_gas.machine_code = '${data.qrcode}'`;
//         pool.query(
//             sql, 
//             (err, result) => {

//                 if (err) 
//                 {
//                     //console.log(err); 
//                     resData.status = "error"; 
//                     resData.statusCode = 200 ;
//                     resData.data = err ;
//                     res.status(resData.statusCode).json(resData)
//                 }
//                 else
//                 {
//                     console.log(result.rows[0]);
//                     let order_id = result.rows[0].id
//                     if(!result.rows[0])
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_qrcode : false
//                         };    
//                         res.status(201).json(resData);
//                     }
//                     else{
//                         // find pwd gasmachine
//                         sql = `SELECT tb_order.id as order_id , tb_order.rider_id as driver_id,"pwdGasMachine" 
//                                 FROM tb_order WHERE tb_order.id =${order_id}`;
//                         pool.query(
//                             sql, 
//                             (err, result) => {
                
//                                 if (err) {
//                                     //console.log(err); 
//                                     resData.status = "error"; 
//                                     resData.statusCode = 200 ;
//                                     resData.data = err ;
//                                     res.status(resData.statusCode).json(resData)
//                                 }
//                                 else
//                                 {    
//                                     resData.status = "success"; 
//                                     resData.statusCode = 201 ;
//                                     resData.data = result.rows[0] ;
//                                     res.status(resData.statusCode).json(resData);
//                                 }
//                             }
//                         );
//                     } 
//                 }
//             }
//         );
//     }
// }

// checkQrCodeMachineReturnGas = (req , res , next) =>{
//     // check กับ machine_code 
//     let data = req.body ;
//     let resData = {
//         status : "",
//         statusCode : 200 ,
//         data : ""
//     }
//     if(data.qrcode == "" || data.qrcode == null)
//     {
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( qrcode )";    
//         res.status(200).json(resData);
//     }   
//     else if(data.driver_id == "" || data.driver_id == null)
//     {
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( driver_id )";    
//         res.status(200).json(resData);
//     } 
//     else 
//     {
//         let sql = `SELECT tb_order.id FROM tb_order
//         INNER JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
//         WHERE tb_order.rider_id = ${data.driver_id} AND tb_machine_gas.machine_code = '${data.qrcode}'`;
//         pool.query(
//             sql, 
//             (err, result) => {

//                 if (err) 
//                 {
//                     //console.log(err); 
//                     resData.status = "error"; 
//                     resData.statusCode = 200 ;
//                     resData.data = err ;
//                     res.status(resData.statusCode).json(resData)
//                 }
//                 else
//                 {
//                     console.log(result.rows[0]);
//                     let order_id = result.rows[0].id
//                     if(!result.rows[0])
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_qrcode : false
//                         };    
//                         res.status(201).json(resData);
//                     }
//                     else{
//                         // find pwd gasmachine
//                         sql = `SELECT tb_order.id as order_id , tb_order.rider_id as driver_id,"pwdGasMachine" 
//                                 FROM tb_order WHERE tb_order.id =${order_id}`;
//                         pool.query(
//                             sql, 
//                             (err, result) => {
                
//                                 if (err) {
//                                     //console.log(err); 
//                                     resData.status = "error"; 
//                                     resData.statusCode = 200 ;
//                                     resData.data = err ;
//                                     res.status(resData.statusCode).json(resData)
//                                 }
//                                 else
//                                 {    
//                                     resData.status = "success"; 
//                                     resData.statusCode = 201 ;
//                                     resData.data = result.rows[0] ;
//                                     res.status(resData.statusCode).json(resData);
//                                 }
//                             }
//                         );
//                     } 
//                 }
//             }
//         );
//     }
// }

// checkPwdMachineStation = (req,res,next) => {
//     // SELECT id, DATE(tb_order."driverReceiveDate") FROM tb_order
//     // WHERE CURRENT_DATE = DATE(tb_order."driverReceiveDate")
//     // AND tb_order."pwdGasMachine" = '592426' 
//     // AND (status <> 4 AND status <> 1 AND status <> 3 AND status <> 6)
//     // AND rider_id IS NOT NULL AND machine_id IS NOT NULL
//     let data = req.body.password_machine;   
//     let resData = {
//         status : "",
//         statusCode : 200 ,
//         data : ""
//     } ;
//     if(data == "" || data == null) 
//     {
//         //console.log(checkParameter)       
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( password_machine )";    
//         res.status(200).json(resData);
//     }
//     else 
//     {
//         let sql = `SELECT id as order_id FROM tb_order
//                 WHERE CURRENT_DATE = DATE(tb_order."driverReceiveDate")
//                 AND tb_order."pwdGasMachine" = '${data}' 
//                 AND (status <> 4 AND status <> 1 AND status <> 3 AND status <> 6 AND status <> 7)
//                 AND rider_id IS NOT NULL AND machine_id IS NOT NULL`;
//         pool.query(
//             sql, 
//             async (err, result) => {

//                 if (err) {
//                     //console.log(err);  
//                     resData.status = "error";
//                     resData.statusCode = 200 ;
//                     resData.data = err;    
//                     res.status(200).json(resData);
//                 }
//                 else
//                 {
//                     console.log(result.rows)
//                     if(result.rows.length == 0)
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_password : false ,
//                             order_detail : []
//                         };    
//                         res.status(201).json(resData);
//                     }
//                     else
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_password : true ,
//                             order_detail : result.rows[0]
//                         };    
//                         res.status(201).json(resData);
//                         // let pwdMachine =  await funRandomNumberString(6) ;
//                         // let checkWhile ;
//                         // let dataPwd ;
//                         // sql = `SELECT id, DATE(tb_order."createDate") FROM tb_order
//                         // WHERE CURRENT_DATE = DATE(tb_order."driverReceiveDate")`;
//                         // pool.query(
//                         //     sql, 
//                         //     async (err, result) => {                
//                         //         if (err) {
//                         //             //console.log(err); 
//                         //             resData.status = "error"; 
//                         //             resData.statusCode = 200 ;
//                         //             resData.data = err ;
//                         //             res.status(resData.statusCode).json(resData)
//                         //         }
//                         //         else
//                         //         {
//                         //             console.log(result.rows)
//                         //             dataPwd = await result.rows ;
//                         //             if(result.rows.length == 0)
//                         //             {
//                         //                 checkWhile = await false ;
//                         //             }
//                         //             else
//                         //             {
//                         //                 checkWhile = await dataPwd.includes(pwdMachine);
//                         //                 while(checkWhile)
//                         //                 {
//                         //                     pwdMachine = await funRandomNumberString(6) ;
//                         //                     checkWhile = await dataPwd.includes(pwdMachine);
//                         //                 }
//                         //                console.log(pwdMachine)
//                         //                 console.log(result.rows[0].id)
//                         //                 UPDATE "public"."tb_order" SET "pwdGasMachine" = '394236' WHERE "id" = 10
//                         //                 sql = `UPDATE "public"."tb_order" 
//                         //                         SET "pwdGasMachine" = '${pwdMachine}' 
//                         //                         WHERE "id" = ${result.rows[0].id}`;
//                         //                 pool.query(
//                         //                     sql, 
//                         //                     (err, result) => {                                    
//                         //                         if (err) {
//                         //                             //console.log(err);  
//                         //                             resData.status = "error";
//                         //                             resData.statusCode = 200 ;
//                         //                             resData.data = "error update password machine : " + err;    
//                         //                             res.status(200).json(resData);
//                         //                         }
//                         //                         else
//                         //                         {
//                         //                             resData.status = "success";
//                         //                             resData.statusCode = 201 ;
//                         //                             resData.data = {
//                         //                                 check_password : true
//                         //                             };    
//                         //                             res.status(201).json(resData);
//                         //                         }
//                         //                     }
//                         //                 ); 
//                         //             }
//                         //         }
//                         //     }
//                         // );
//                     }                   
//                 }
//             }
//         );
//     }    
// }








module.exports = {
    
    getOrderInCartByUserId,
    addOrderInCartByUserId,
    editOrderInCartById,
    deleteOrderInCartById,
    getOrderByUserId,
    getOrderHistoryAllByUserId,
    getOrderByOderId,
    addOrderUser,
    editOrderUser,
    cancalOrderUser,
    sendOrderToDriver,
    driverReceiveOrder,
    getDriverOrderReviceByDriverId,
    // checkQrCodeMachineReceiveGas,
    // checkPwdMachineStation

}