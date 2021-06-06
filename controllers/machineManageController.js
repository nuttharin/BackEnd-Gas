const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position ,PositionUserId, Rider , Order , UserData} = require("../model/userModel");
const { BankDriver ,BankDriverData,PositionDriver} = require("../model/driverModel");
const {funCheckParameterWithOutId,funCheckParameter} =  require('../function/function');
const { generateToken , generateRefreshToken} = require('../controllers/appTokenManageController');
const axios = require('axios');
const apiPath = {
    gasOut : "",
    gasIn : ""
}

const coilParameter = {
    returnGas : 0 ,
    receiveGas : 1
}

testAxios = async () =>{
    await axios.get('http://192.168.1.156:5000/testplc')
    .then(function (response) {
        // handle success
        console.log(response);
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}

test1 = async (req ,res ,nex) =>{
    let data = {
        data : "x"
    }
    res.json(data)
}

registerMachince = () =>{
    
}

updateStatusReceiveGas = (req ,res , next) =>{
    // UPDATE "public"."tb_order_detail" SET "statusReceive" = 1 WHERE "id" = 25
}

getMachineCodeFromIP = (req ,res , next) =>{
    let data = req.query.ip
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    if(data == "" || data == null)
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( IP )";    
        res.status(200).json(resData);
    }   
    else {
        let sql = `SELECT id , machine_code FROM tb_machine_gas
                    WHERE tb_machine_gas.ip = '${data}'`;
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
                    resData.data = result.rows[0];
                    res.status(resData.statusCode).json(resData);
                }
            }
        );
    }
}




// ==========  check qr code ========== //


// checkQrCodeMachineReceiveGasForUser = (req , res , next) =>{
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
//     else if(data.user_id == "" || data.user_id == null)
//     {
//         resData.status = "error";
//         resData.statusCode = 200 ;
//         resData.data = "not have parameter ( user_id )";    
//         res.status(200).json(resData);
//     } 
//     else 
//     {
//         let sql = `SELECT tb_order.id as order_id , tb_order.user_id as user_id,"pwdGasMachine" FROM tb_order
//         INNER JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
//         WHERE tb_order.user_id = ${data.user_id} 
//         AND tb_machine_gas.machine_code = '${data.qrcode}'
//         AND CURRENT_DATE = DATE(tb_order."createDate")`;
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
//                     if(!result.rows[0])
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_qrcode : false
//                         };    
//                         res.status(resData.statusCode).json(resData);
//                     }
//                     else
//                     {
//                         resData.status = "success"; 
//                         resData.statusCode = 201 ;
//                         resData.data = result.rows[0] ;
//                         res.status(resData.statusCode).json(resData);
                        
//                     } 
//                 }
//             }
//         );
//     }
// }

// checkQrCodeMachineReceiveGasForDriver = (req , res , next) =>{
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
//         let sql = `SELECT tb_order.id as order_id , tb_order.rider_id as driver_id,"pwdGasMachine" FROM tb_order
//         INNER JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
//         WHERE tb_order.rider_id = ${data.driver_id} 
//         AND tb_machine_gas.machine_code = '${data.qrcode}'`;
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
//                     //console.log(result.rows[0]);
//                     if(!result.rows[0])
//                     {
//                         resData.status = "success";
//                         resData.statusCode = 201 ;
//                         resData.data = {
//                             check_qrcode : false
//                         };    
//                         res.status(resData.statusCode).json(resData);
//                     }
//                     else
//                     {
//                         // find pwd gasmachine
//                         resData.status = "success"; 
//                         resData.statusCode = 201 ;
//                         resData.data = result.rows[0] ;
//                         res.status(resData.statusCode).json(resData);
                        
                        
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

// checkQrCodeMachineReturnGasForUser  = (req , res , next) =>{
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


// checkQrCodeMachineReturnGasForDriver = (req , res , next) =>{
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





// ========== end =========== //











updateGasOutInByOrderId = (req, res ,next) =>{
    let data =req.body;
    console.log(data)
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    } ;
    //console.log(data.order_id)
    if(data.order_id === "" ) 
    {
        //console.log(checkParameter)       
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( order_id )";    
        res.status(200).json(resData);
    }
    else if(data.quality === "")
    {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( quality )";    
        res.status(200).json(resData);
    }
    else{   
        let sql = `UPDATE "public"."tb_order_detail" SET "qualityReceive" = ${data.quality} 
        WHERE "id" = ${data.order_id}`;
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
                    resData.data = "update complete";
                    res.status(201).json(resData);
                }
            }
        );
    }
}

sendCommandToMachineGasOut = async (req,res,next) =>{
    let data = req.body.order_id
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

        let sql = `SELECT tb_order.id as order_id , tb_order_detail.quality , tb_machine_gas.ip FROM tb_order
                    LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
                    LEFT JOIN tb_order_detail ON tb_order_detail.order_id = tb_order.id
                    WHERE tb_order.id = ${data}`;
        pool.query(
            sql, 
            async (err, result) => {
    
                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statuCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statuCode).json(resData)
                }
                else
                {    
                    // resData.status = "success"; 
                    // resData.statuCode = 201 ;
                    // resData.data = result.rows ;
                    // res.status(resData.statuCode).json(resData);
                    //console.log(result.rows[0])
                    await axios.post(
                        `http://${result.rows[0].ip}/machine/command/gasOut`,
                        {
                            number_order : result.rows[0].quality,
                            order_id : result.rows[0].order_id
                        }
                    )
                    .then(function (response) {
                        // handle success
                        //console.log(response);
                        //console.log(response.data)
                        if(response.data.statuCode == 201)
                        {
                            //console.log("sss")
                            resData.status = "success"; 
                            resData.statusCode = 201 ;
                            resData.data = response.data.data ;
                            res.status(resData.statusCode).json(resData);
                        }
                        else {
                            // alert 
                            resData.status = "error";
                            resData.statusCode = 200 ;
                            resData.data = "error machine :" + response.data.data;    
                            res.status(200).json(resData);
                        }                      

                    })
                    .catch(function (error) {
                        // handle error
                        // alert
                        //console.log(error);
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "error machine :" + error;    
                        res.status(200).json(resData);
                    })
                }
            }
        );     
    }   
}

sendCommandToMachineGasIn = async (req,res,next) =>{

}

sendCommandToMachineStatusDoor = async (req,res,next) =>{

}

testSendCommandToMachine = async (req,res,next) =>{
    let data = req.body.order_id
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

        let sql = `SELECT tb_order.id as order_id , tb_order_detail.quality , tb_machine_gas.ip FROM tb_order
                    LEFT JOIN tb_machine_gas ON tb_order.machine_id = tb_machine_gas.id
                    LEFT JOIN tb_order_detail ON tb_order_detail.order_id = tb_order.id
                    WHERE tb_order.id = ${data}`;
        pool.query(
            sql, 
            async (err, result) => {
    
                if (err) {
                    //console.log(err); 
                    resData.status = "error"; 
                    resData.statuCode = 200 ;
                    resData.data = err ;
                    res.status(resData.statuCode).json(resData)
                }
                else
                {    
                    // resData.status = "success"; 
                    // resData.statuCode = 201 ;
                    // resData.data = result.rows ;
                    // res.status(resData.statuCode).json(resData);
                    //console.log(result.rows[0])
                    await axios.post(
                        `http://${result.rows[0].ip}/machine/command/test`,
                        {
                            command_str_0 :0,
                            command_str_1 :1,
                        }
                    )
                    .then(function (response) {
                        // handle success
                        //console.log(response);
                        //console.log(response.data)
                        if(response.data.statuCode == 201)
                        {
                            //console.log("sss")
                            resData.status = "success"; 
                            resData.statusCode = 201 ;
                            resData.data = response.data.data ;
                            res.status(resData.statusCode).json(resData);
                        }
                        else {
                            // alert 
                            resData.status = "error";
                            resData.statusCode = 200 ;
                            resData.data = "error machine :" + response.data.data;    
                            res.status(200).json(resData);
                        }                      

                    })
                    .catch(function (error) {
                        // handle error
                        // alert
                        //console.log(error);
                        resData.status = "error";
                        resData.statusCode = 200 ;
                        resData.data = "error machine :" + error;    
                        res.status(200).json(resData);
                    })
                }
            }
        );     
    }   



}

testGasIn  = async (req,res,next) =>{ 
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    //192.168.0.114
    await axios.post(
        `http://192.168.0.114:5000/machine/command/gasIn`,
        {
            command_str_0 :0,
            command_str_1 :0,
        }
    )
    .then(function (response) {
        // handle success
        //console.log(response);
        //console.log(response.data)
        if(response.data.statuCode == 201)
        {
            //console.log("sss")
            resData.status = "success"; 
            resData.statusCode = 201 ;
            resData.data = response.data.data ;
            res.status(resData.statusCode).json(resData);
        }
        else {
            // alert 
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "error machine :" + response.data.data;    
            res.status(200).json(resData);
        }                      

    })
    .catch(function (error) {
        // handle error
        // alert
        //console.log(error);
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "error catch machine :" + error;    
        res.status(200).json(resData);
    })
}

testGasOut  = async (req,res,next) =>{
    let resData = {
        status : "",
        statusCode : 200 ,
        data : ""
    }
    await axios.post(
        `http://192.168.0.114:5000/machine/command/gasOut`,
        {
            command_str_0 :0,
            command_str_1 :1,
        }
    )
    .then(function (response) {
        //handle success
        //console.log(response);
        //console.log(response.data)
        if(response.data.statuCode == 201)
        {
            //console.log("sss")
            resData.status = "success"; 
            resData.statusCode = 201 ;
            resData.data = response.data.data ;
            res.status(resData.statusCode).json(resData);
        }
        else {
            // alert 
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "error machine :" + response.data.data;    
            res.status(200).json(resData);
        }                      

    })
    .catch(function (error) {
        // handle error
        // alert
        //console.log(error);
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "error catch machine :" + error;    
        res.status(200).json(resData);
    })
}




module.exports ={
    testAxios,
    test1,
    // checkQrCodeMachineReceiveGasForUser,
    // checkQrCodeMachineReceiveGasForDriver,
    // checkQrCodeMachineReturnGasForUser,
    // checkQrCodeMachineReturnGasForDriver,
    //checkPwdMachineStation,
    updateGasOutInByOrderId,
    sendCommandToMachineGasOut,
    sendCommandToMachineGasIn,
    sendCommandToMachineStatusDoor,
    testSendCommandToMachine,
    getMachineCodeFromIP,
    testGasIn,
    testGasOut
}
