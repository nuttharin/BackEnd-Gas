const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { Gas } = require("../model/gasModel");
const { Double } = require("mongodb");
const moment = require('moment');
var nameTable = "tb_gasDataIoT";
nameTable = 'tb_test2'



collectPressureIoT = (req , res , next) =>{
    let pressure = 50;
    let serialNumber = "A111111111"; 

    for (let i = 0; i < 1000; i++) {
        if(i%10 == 0)
        {
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
        }
      


             
    }
    res.json("success");

    


}

getLastPressureBySerialNumber = async (req , res , next) =>{ 

    let data = new Gas();
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






module.exports = {
    getLastPressureBySerialNumber,
    collectPressureIoT 
};