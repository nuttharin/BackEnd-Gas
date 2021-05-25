const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { Gas } = require("../model/gasModel");
const { Double } = require("mongodb");
const moment = require('moment');
var nameTable = "tb_gasDataIoT";
var nameMapTable = "tb_mapAround";
//nameTable = 'tb_test2' ;

collectPressureIoT = (req , res , next) =>{
    
    let newDate = new Date();  
    let data = req.body ;
    data = data.dataInsert ;
    console.log(data);
    MongoClient.connect(URL_MONGODB_IOT,function(err,db){
        let dbo = db.db(process.env.DATABASE_DATA_IOT);

        dbo.collection("tb_test3")
        .insertOne( { 
            serialNumber : data.serialNumber, pressure : Double(data.pressure), dateTime : newDate 
        } ,(err,result) =>
        {
            if(err)
            {
                console.log("error")
                throw err;
            }
            else
            {
                //console.log("insert complete");
                res.status(200).json({
                    status : "success",
                    data : ""
                });

            }
        });
    })     
      


             
    

};


collectPressureIoT2 = (req , res , next) =>{ 
    let pressure = 70;
    let serialNumber = "A111111111"; 

   
            let newDate = new Date();       
            MongoClient.connect(URL_MONGODB_IOT,function(err,db){
                let dbo = db.db(process.env.DATABASE_DATA_IOT);
                
                dbo.collection("tb_test2")
                .insertOne( { serialNumber : serialNumber, pressure : Double(pressure--), dateTime : newDate } ,(err,result)=>
                {
                    if(err)
                    {
                        console.log("error")
                        throw err;
                    }
                    else
                    {
                        
                        console.log("insert complete")
                    }

                });
            })
        
      


             
    
    res.json("success");

};

registerGasIoT = (req, res, next)=>{
    let newDate = new Date();       
    let data = req.body ;
    console.log(data)

    MongoClient.connect(URL_MONGODB_IOT,function(err,db)
    {
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        
        dbo.collection(nameMapTable)
        .insertOne( { serialNumber : data.serialNumber, Around : 1 ,dateTime : newDate } ,(err,result)=>
        {
            if(err)
            {
                res.status(200).json({
                    status : "error",
                    data : ""
                });
            }
            else
            {                
                res.status(200).json({
                    status : "success",
                    data : ""
                });
            }
        });
    });
}

resetGasIoT = (req , res , next) =>{
    let newDate = new Date();   
    let data = req.body ;

    MongoClient.connect(URL_MONGODB_IOT,function(err,db){
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        
        dbo.collection(nameMapTable)
        .insertOne( { serialNumber : serialNumber, Around : 1 ,dateTime : newDate } ,(err,result)=>
        {
            if(err)
            {
                // console.log("error")
                // throw err;
                res.status(200).json({
                    status : "error",
                    data : ""
                });
            }
            else
            {                
                res.status(200).json({
                    status : "success",
                    data : ""
                });
            }
        });
    });
}




getLastPressureBySerialNumber = async (req , res , next) =>{ 

    let data = new Gas();
    let dataBody = req.body ;
    //data.serialNumber = req.body.serialNumber ;
    data.serialNumber = 'A111111111'
    if( data.serialNumber == null ||  data.serialNumber == "")
    {
        let data = {
            status : "error",
            data : "not have serialNumber"
        }   
        res.json(data)
    }
    else
    {
        MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
        {
            if (err) throw err;
            let dbo = db.db(process.env.DATABASE_DATA_IOT);
            var mysort = { dateTime : -1 };
            dbo.collection(nameTable)
            .find({ serialNumber: { $eq : data.serialNumber } } , {_id : 0}).sort(mysort).limit(-1)
            .toArray(function(err, result) 
            {
                //console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
                result[0].dateTime = moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss');
                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : "query command error"
                    }   
                    res.json(data);
                }
                else
                {
                    let data = {
                        status : "success",
                        data : result[0]
                    }
                    res.json(data);
                }
    
                db.close();
            });
        });
    }
  
};



getPercentPressureBySerialNumber = async (req , res , next) =>{ 

    let data = new Gas();
    let dataLast ;
    let dataFrist ;
    //data.serialNumber = req.body.serialNumber ;
    //console.log(req.query.serialNumber)
    data.serialNumber = req.query.serialNumber ;
    if( data.serialNumber == null ||  data.serialNumber == "")
    {
        let data = {
            status : "error",
            data : "not have serialNumber"
        }   
        res.json(data)
    }
    else
    {
        await MongoClient.connect(URL_MONGODB_IOT, function(err, db) 
        {
            if (err) throw err;
            let dbo = db.db(process.env.DATABASE_DATA_IOT);
            var mysort = { dateTime : -1 };
           
            dbo.collection(nameTable)
            .find({ serialNumber: { $eq : data.serialNumber } } , {_id : 0})
            .sort(mysort)
            .limit(-1)
            .toArray(function(err, result) 
            {
                //console.log(result)
                //console.log(moment(result[0].dateTime).format(' D/MM/YYYY h:mm:ss'))
                if(err) {
                    res.status(400).json(err)
                }
                else if(result.length > 0)
                {
                    //console.log(result)
                    dataLast = result[0] ;
                    mysort = { dateTime : 1 };

                    dbo.collection(nameTable)
                    .find(
                        { 
                            serialNumber: { $eq : data.serialNumber } 
                        } 
                        , { _id : 0}
                    )
                    .sort(mysort)
                    .limit(-1)
                    .toArray(function(err, result) 
                    {
                        //console.log(result)
                        if(err) {
                            res.status(400).json(err)
                        }                        
                        else 
                        {
                            dataFrist = result[0] ;   
                            
                            let dataJson = {
                                serialNumber : dataLast.serialNumber,
                                pressure : dataLast.pressure,
                                decreasePercent :(dataFrist.pressure - dataLast.pressure)/dataFrist.pressure*100 ,
                                dateTime : moment(dataLast.dateTime).format(' D/MM/YYYY h:mm:ss')
                            }
                            
                            
                            res.status(200).json({
                                status : "success",
                                data : dataJson
                            });   

                        }

                    });
                    db.close();

                }
                else {
                    res.status(200).json({
                        status : "success",
                        data : "ไม่มีข้อมูล"
                    });      
                }
               
            });

           
            
        });
    }
};

getAllPressure = async (req , res , next) =>{

};


module.exports = {
    getLastPressureBySerialNumber,
    collectPressureIoT2,
    getPercentPressureBySerialNumber,
    resetGasIoT,
    registerGasIoT

};