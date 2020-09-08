const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User } = require("../model/userModel");


// GET

getProvince = (req , res , next) => {
    let sql = `select id , name_th , name_en from tb_province ORDER BY id ASC `;
    pool.query(
        sql, 
        (err, results) => {

            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : ""
                }   
                res.json(data)
            }
            else
            {
                let data = {
                    status : "success",
                    data : results.rows
                }
                res.json(data);
            }
        }
    );

};

getAmphure = (req , res, next) => {

    let idProvince = req.query.idProvince ;
    if(idProvince == null || idProvince == "")
    {
        let data = {
            status : "error",
            data : "not have idProvince"
        }   
        res.json(data)
    }
    else
    {
        let sql = `select id , name_th, name_en from tb_amphure where province_id =`+parseInt(idProvince)+` ORDER BY id ASC `;
        pool.query(
            sql, 
            (err, results) => {
    
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
                        data : results.rows
                    }
                    res.json(data);
                }
            }
        );
    }

   
};

getDistrict = (req, res, next) =>{
    let idAmphure = req.query.idAmphure ;
    if(idAmphure == null || idAmphure == "")
    {
        let data = {
            status : "error",
            data : "not have idAmphure"
        }   
        res.json(data)
    }
    let sql = `select name_th,name_en,zip_code from tb_district where amphure_id = `+parseInt(idAmphure)+` ORDER BY id ASC `;
    pool.query(
        sql, 
        (err, results) => {
            //console.log(err)
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
                    data : results.rows
                }
                res.json(data);
            }
        }
    );
}




// POST

login = (req , res , next) =>{ 
};

register = (req , res , next) =>{ 
    
};















module.exports = {
    getProvince,
    getAmphure,
    getDistrict
};