const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position , Rider , Order } = require("../model/userModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');
const bcrypt = require('bcryptjs');
saltRounds = process.env.SALTROUND_SECRET ;


// GET




getPositionByUserid = (req, res, next) =>{
   
    let parameter = req.query;
    let user_id = parameter.user_id ;
    //console.log(parameter);
    let resData = {
        status : "",
        data : ""
    }   
    if(user_id == "" || user_id == undefined)
    {
        resData.status = "error";
        resData.data = "not have parameter ( user_id )";
        res.status(400).json(resData);
    }
    else{
        let sql = `SELECT tb_province.name_th province,tb_amphure.name_th amphure
                    ,tb_district.name_th district,tb_user_address.road road
                    ,tb_user_address.other other,tb_district.zip_code zip_code
                    ,tb_user_address.name_address name_address
                    FROM tb_user_address
                    LEFT JOIN tb_province ON tb_province.id = tb_user_address.province_id
                    LEFT JOIN tb_amphure ON tb_amphure.id = tb_user_address.amphure_id
                    LEFT JOIN tb_district ON tb_district.id = tb_user_address.district_id
                    where tb_user_address.user_id = ${user_id} ;`;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error";
                    res.status(400).json(resData);
                }
                else
                {
                    resData.status = "success";
                    resData.data = result.rows;                
                    res.status(200).json(resData);
                }
            }
        );
    }

}

// get order ทั้งหมด
getOrderAll = (req, res, next) =>{    
} 

// get order ที่เรารับ
getOrderByRiderId = (req, res, next) =>{
    console.log('getOrderAll');
    let sql = `  `;
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
                console.log(result.rows)
                console.log(result.rows.order_gas)
                result.rows.order_gas = JSON.parse(result.rows.order_gas) ;
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
            }
        }
    );
} 

getOrderHistoryByRiderId = (req, res, next)=>{
    console.log('getOrderHistory');
    let sql = `  `;
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
                console.log(result.rows)
                console.log(result.rows.order_gas)
                result.rows.order_gas = JSON.parse(result.rows.order_gas) ;
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
            }
        }
    );
}

getOrderByProvince = (req, res, next) =>{

} 





// POST

login = (req , res , next) =>{ 

    bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
        // result == true
    });
};

registerUser = (req , res , next) =>{ 
};

registerRider = async (req , res , next) =>{
    let data = req.body ;
    let rider = new Rider();
    let checkParameter = await funCheckParameterWithOutId(data) ;
    //console.log(checkParameter)
    
    if(checkParameter != "")
    {
        //console.log(checkParameter)
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )"
        res.status(400).json(resData);
    }
    else
    {
        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            // Store hash in your password DB.
        });

        let sql = ` INSERT INTO public.tb_rider(
                    name, password, "idCard", email, phone, "createDate", "modifyDate")
                    VALUES ( 'rider 1', '', '1129900402241', 
                    'nut_514@hotmail.com', '0812318897', 
                    '11/02/2020 00:00:00', '11/02/2020 00:00:00'); `;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error";
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

 
userAddPosition = async  (req, res, next) =>{
    let parameter = req.body;    
    let data = new Position();   
    data.user_id = parameter.user_id;
    data.province_id = parameter.province_id;
    data.amphure_id = parameter.amphure_id;
    data.district_id = parameter.district_id;
    data.other = parameter.other;
    data.road = parameter.road;
    data.name_address = parameter.name_address;
    //console.log(data)
    let resData = {
        status : "",
        data : ""
    }   
    //let checkParameter  = true ;
    let checkParameter = await funCheckParameterWithOutId(data) ;
    //console.log(checkParameter)
    
    if(checkParameter != "")
    {
        //console.log(checkParameter)
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )"
        res.status(400).json(resData);
    }
    else
    {
        let sql = ` INSERT INTO public.tb_user_address(
            user_id, province_id, amphure_id, district_id, road, other, name_address)
            VALUES (  ${data.user_id}, ${data.province_id}, ${data.amphure_id}, 
                        '${data.district_id}', '${data.road}', '${data.other}', '${data.name_address}'); `;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    //console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error";
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
    //res.status(200).json(resData);

}
  
userOrderGas = async (req, res, next) => {
    let parameter = req.body;
    console.log(parameter)
    let data = new Order() ;
    data.user_id = parameter.user_id ;
    data.address_id = parameter.address_id ;
    data.rider_id = parameter.rider_id ;   
    data.type_delivery = parameter.type_delivery ;
    data.order_gas = parameter.order_gas ;

    data.status = "no receive" ;
    let resData = {
        status : "",
        data : ""
    }   
    //let checkParameter  = true ;
    let checkParameter = await funCheckParameterWithOutId(data) ;
    if(checkParameter != "")
    {
        //console.log(checkParameter)
        resData.status = "error";
        resData.data = "not have parameter ( "+ checkParameter +" )"
        res.status(400).json(resData);
    }
    else
    {
        let sql = ` INSERT INTO public.tb_gas_order(
            user_id, address_id, type_delivery, order_gas, status, rider_id)
            VALUES (${data.user_id}, ${data.address_id}, '${data.type_delivery}', '${data.order_gas}'
            , '${data.status}', ${data.rider_id}); `;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    console.log(err);                      
                    resData.status = "error";
                    resData.data = "query command error : "+ err;
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

userCancelOrder = (req, res, next) => {
     
}

riderGetOrder = (req, res, next) =>{

}























module.exports = {
    userAddPosition,
    userOrderGas,
    getPositionByUserid,
    getOrderAll,
    getOrderByProvince,
    getOrderByRiderId
};