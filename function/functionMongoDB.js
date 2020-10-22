const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");




// insertIoTMongoDB = async (nameTable , data) =>{   
   
//     await MongoClient.connect(URL_MONGODB_IOT,function(err,db){
//         let dbo = db.db(process.env.DATABASE_DATA_IOT);
//         let status = false;       
//         dbo.collection(nameTable)
//         .insertOne( data ,async (err,result)=>
//         {
//             if(err)
//             {             
//                 console.log("err")
//             }
//             else
//             {                
//                 console.log("insert complete")
//             } 
//         });       
//     });
// }

async function insertIoTMongoDB(nameTable , data){
    MongoClient.connect(URL_MONGODB_IOT, async function (err,db){
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        let status = false;       
        await dbo.collection(nameTable)
        .insertOne( data ,async (err,result)=>
        {
            if(err)
            {             
                console.log("err")
            }
            else
            {                
                console.log("insert complete")
                return true
            } 
        });       
    });
}

updateIoTMongoDB = async () => {

}


module.exports = {
    insertIoTMongoDB
}