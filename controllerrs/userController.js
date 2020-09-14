const { pool , MongoClient , URL_MONGODB_IOT } = require("../dbConfig");
const { User , Position } = require("../model/userModel");


// GET

getProvince = (req , res , next) => {
    let sql = `select id , name_th , name_en from tb_province ORDER BY id ASC `;
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
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
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
        res.status(400).json(data)
    }
    else
    {
        let sql = `select id , name_th, name_en from tb_amphure where province_id =`+parseInt(idProvince)+` ORDER BY id ASC `;
        pool.query(
            sql, 
            (err, result) => {
    
                if (err) {
                    //console.log(err);  
                    let data = {
                        status : "error",
                        data : "query command error"
                    }   
                    res.status(400).json(data);
                }
                else
                {
                    let data = {
                        status : "success",
                        data : result.rows
                    }
                    res.status(200).json(data);
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
        (err, result) => {
            //console.log(err)
            if (err) {
                //console.log(err);  
                let data = {
                    status : "error",
                    data : "query command error"
                }   
                res.status(400).json(data);
            }
            else
            {
                let data = {
                    status : "success",
                    data : result.rows
                }
                res.status(200).json(data);
            }
        }
    );
}

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






// POST

login = (req , res , next) =>{ 
};

register = (req , res , next) =>{ 
};

funCheckParameter = async (data) => {
    let dataKey = "" ;
    await Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        if( (value == '' || value == undefined) && key != 'id' )
        {
          
            dataKey = key ;
           
        }
    });
    return dataKey;
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
    let checkParameter = await funCheckParameter(data) ;
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

getGasDetail = (req ,res ,next) =>{
    
}


















module.exports = {
    getProvince,
    getAmphure,
    getDistrict,
    userAddPosition,
    getPositionByUserid
};