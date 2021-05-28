
const axios = require('axios');
const { resource } = require('../app');
const key = process.env.GOOGLE_MAP_KEY ;
const urlGoogleMap = process.env.GOOGLE_MAP_URL ;
const { pool } = require("../dbConfig");
 


let position1 ;
let position2 ;
let sql ;

let returnData = {
    status : "OK"
}



findDistanceMatrix = async (posit1 , posit2) =>{
    position1 = posit1
    position2 =  posit2
    let myPromise = new Promise( async (myResolve, myReject) => {
        let urlDistanceMatrix = `distancematrix/json?origins=${position1}&destinations=side_of_road:${position2}&language=th&key=${key}`;
        await axios.get(urlGoogleMap + urlDistanceMatrix)
        .then( async (response) => {
            // handle success
            //console.log(response.data);
            if(response.data.status == "OK")
            {
                let elements = response.data.rows[0].elements[0] ;
                let finalData =  {
                    status : "OK" ,
                    destination_addresses : response.data.destination_addresses[0] ,
                    origin_addresses : response.data.origin_addresses[0] ,
                    distance : {
                        kilometer : elements.distance.text ,
                        meter :elements.distance.value
                    },
                    duration : {
                        minute : elements.duration.text ,
                        secound :elements.duration.value
                    },
                }

                returnData = await finalData ;
                //returnData.distance =  ;
            
                //return returnData ;
                myResolve(returnData);   

            }
            else
            {
                returnData.status = "NO" ;
                //return returnData ;
                myResolve(returnData);   

            }
            //myResolve(returnData);   
        
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
    });
    return myPromise ;
}

rad = async (data) => {
    let res = await data * Math.PI / 180;
    return res ;
}

funFindDistance = async (p1 , p2) => {
    
}

funFindDistance2 = async (p1 , p2) => {
    
}

funFindMachineNearest = async (address_id ) =>{
    //console.log(address_id)
    let positionNearest ;
    let distanceMin = Number.MAX_SAFE_INTEGER ;
    let dLat ;
    let dLon ;
    let a , c , d ;
    let R = 6378137; // Earth’s mean radius in meter
    let myPromise = new Promise(function(myResolve, myReject) {
        // get all machine
        sql = `SELECT id as machine_id , lat , lon  FROM tb_machine_gas 
                WHERE tb_machine_gas."isDelete" = 0`;
        pool.query(
            sql, 
            (err, result) => {

                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error tb_machine_gas : " + err;    
                    res.status(200).json(resData);
                }
                else
                {
                    //console.log("1" , result.rows)
                    let arrMachineAddress = result.rows ; 
                    // get lat lon of address_id
                    sql = `SELECT id as address_id , latitude as lat, longitude as lon 
                            FROM tb_address_user 
                            WHERE tb_address_user."id" = ${address_id}`;
                    pool.query(
                        sql, 
                        async (err, result) => {

                            if (err) {
                                //console.log(err);  
                                resData.status = "error";
                                resData.statusCode = 200 ;
                                resData.data = "error tb_machine_gas : " + err;    
                                res.status(200).json(resData);
                            }
                            else
                            {
                                //console.log(result.rows)
                                let orderAddress = result.rows[0] ;
                                let p1 = await orderAddress ;

                                arrMachineAddress.forEach( async (p2) => {

                                    dLat =  (p2.lat - p1.lat) * Math.PI / 180;
                                    dLon =  (p2.lon - p1.lon ) * Math.PI / 180;
                                    // console.log(p1.lat + " " + p1.lon + " " +dLat) 
                                    // console.log(p2.lat + " " + p2.lon + " " +dLong)       
                                    a =  Math.sin(dLat/2) * Math.sin(dLat/2) +
                                            Math.cos(p1.lat * Math.PI / 180) * Math.cos(p1.lat * Math.PI / 180) * 
                                            Math.sin(dLon/2) * Math.sin(dLon/2)
                                            ; 
                                    c =  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                                    d =  R * c;
                                    console.log("d => " + d + "m")
                                    if(d < distanceMin)
                                    {
                                        distanceMin = await d ;
                                        positionNearest = p2 ;
                                    }                                    
                                    myResolve(positionNearest);                                
                                })                                
                            }
                        }
                    );
                }
            }
        );          
    });
  
    return myPromise ;
}

funFindDriverNearest = async (dataOrderMachine,distanceFix) => {
    //dataOrderMachine ข้อมูลของ machine ที่ order นั้นอยู่
    //distanceFix ระยะทางค้นหา driver (km)

    distanceFix = distanceFix * 1000 ; // KM
    let driverAll  ;
    let driverNearestDistanceFix = [] ;
    let R = 6378137; // Earth’s mean radius in meter
    
    //let driverAll ;

    // get lat lon of address_id
    let myPromise = new Promise(function(myResolve, myReject) {

        sql = `SELECT tb_rider.id as driver_id , lat , lon FROM tb_rider 
        WHERE tb_rider."isDelete" = 0 AND tb_rider."statusWork" = 1 
        AND NOT tb_rider.id IN(SELECT DISTINCT tb_order_send_driver.driver_id 
        FROM tb_order_send_driver WHERE tb_order_send_driver.status = 1)`;
        pool.query(
            sql, 
            async (err, result) => {

                if (err) {
                    //console.log(err);  
                    resData.status = "error";
                    resData.statusCode = 200 ;
                    resData.data = "error tb_machine_gas : " + err;    
                    res.status(200).json(resData);
                }
                else
                {
                    if(result.rows.length >  0)
                    {
                        console.log(result.rows)
                        driverAll = await result.rows ;
                        let p1 = await dataOrderMachine ;
                        // console.log("1" , p1)
                        // console.log("2" ,driverAll)
                    
                        driverAll.forEach( async (p2) => {

                            dLat =  (p2.lat - p1.lat) * Math.PI / 180;
                            dLon =  (p2.lon - p1.lon ) * Math.PI / 180;
                            // console.log(p1.lat + " " + p1.lon + " " +dLat) 
                            // console.log(p2.lat + " " + p2.lon + " " +dLong)       
                            a =  Math.sin(dLat/2) * Math.sin(dLat/2) +
                                    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p1.lat * Math.PI / 180) * 
                                    Math.sin(dLon/2) * Math.sin(dLon/2)
                                    ; 
                            c =  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                            d =  R * c;
                            console.log("d => " + d + "m")
                            // console.log(d +  "<=" + distanceFix)

                            if(d <= distanceFix)
                            {
                                //console.log(d +  "<=" + distanceFix)
                                driverNearestDistanceFix.push(p2)
                            }        
                            //console.log(driverNearestDistanceFix)                            
                            myResolve(driverNearestDistanceFix);                                
                        })        
                    }
                    else
                    {
                        myResolve(driverNearestDistanceFix);                                

                    }
                                            
                }
            }
        );
    });
    return myPromise
   
}


funFindDistanceNear = async (origin , destination , distanceFix) =>{
    // origin = { lat : 1 , lon : 2}
    // destination = [{lat : 1 , lon: 2} , lat : 1 , lon: 2}]
    // p1 = origin ;
    // p2 = destination ;

    let R = 6378137; // Earth’s mean radius in meter
    let arrOrderAll = [] ;
    let orderInDistance = [] ;
    let distanceMin = 0 ;
    let distanceMinOrderId ;
    let p1 = await origin ;
    let dLat ;
    let dLon ;
    let a , c , d ;    
    let myPromise = new Promise(function(myResolve, myReject) {
        destination.forEach( async (p2) => { 
            dLat =  (p2.lat - p1.lat) * Math.PI / 180;
            dLon =  (p2.lon - p1.lon ) * Math.PI / 180;
            // console.log(p1.lat + " " + p1.lon + " " +dLat) 
            // console.log(p2.lat + " " + p2.lon + " " +dLong)       
            a =  Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p1.lat * Math.PI / 180) * 
                    Math.sin(dLon/2) * Math.sin(dLon/2)
                    ; 
            c =  2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            d =  R * c;
        console.log(d)
            arrOrderAll.push( { order_id : p2.order_id, distance :  d });
            myResolve(arrOrderAll);
        
        })
    });
  
    return myPromise ;
}

funFindMachineInCircleNear = async (orderOrigin , r) => {
    
    // SELECT id as machine_id , lat , lon  FROM tb_machine_gas 
    // WHERE tb_machine_gas."isDelete" = 0

    
    let sql = `SELECT id as machine_id , lat , lon  FROM tb_machine_gas 
                WHERE tb_machine_gas."isDelete" = 0`;
    pool.query(
        sql, 
        (err, result) => {

            if (err) {
                //console.log(err);  
                resData.status = "error";
                resData.statusCode = 200 ;
                resData.data = "error tb_machine_gas : " + err;    
                res.status(200).json(resData);
            }
            else
            {
                // resData.status = "success";
                // resData.statusCode = 201 ;
                // resData.data = "update complete";    
                // res.status(201).json(resData);
                console.log(orderOrigin , r)
                console.log(result.rows)
            }
        }
    );
}





module.exports = {
    findDistanceMatrix ,
    funFindDistanceNear ,
    funFindMachineInCircleNear ,
    funFindMachineNearest ,
    funFindDriverNearest
}