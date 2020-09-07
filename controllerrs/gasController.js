const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User } = require("../model/gasModel");
const nameTable = "tb_gasDataIoT";




getLastPressure= (req , res , next) =>{ 
    MongoClient.connect(URL_MONGODB_IOT, function(err, db) {
        if (err) throw err;
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        dbo.collection(nameTable)
        .find({})
        .toArray(function(err, result) 
        {
            if (err) throw err;
            console.log(result);

            res.json(result);

            db.close();
        });
    });
};

