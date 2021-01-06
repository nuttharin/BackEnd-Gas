const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");



testMongodb = (req , res , next) =>{

    MongoClient.connect(URL_MONGODB_IOT, function(err, db) {
        if (err) throw err;
        let dbo = db.db(process.env.DATABASE_DATA_IOT);
        dbo.collection("deviceTest")
        .find({})
        .toArray(function(err, result) 
        {
            if (err) throw err;
            console.log(result);

            res.json(result);

            db.close();
        });
    });
}

testPostgres = (req , res , next) =>{
    pool.query(
        `SELECT * FROM public.accounts
        ORDER BY user_id ASC `
        , (err, results) => {

            if (err) {
                console.log(err);     
            }
            else{
                res.json(results.rows)
            }

            //console.log(results.rows);
  
         
        }
    );
}

module.exports = {
    testMongodb,
    testPostgres
}




