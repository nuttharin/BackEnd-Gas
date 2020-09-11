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






// POST

login = (req , res , next) =>{ 
};

register = (req , res , next) =>{ 
    
};


userAddPosition =  (req, res, next) =>{
    let parameter = req.body;    
    //data = req.data ; 
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
    let checkParameter  = true ;
    Object.entries(data).forEach(entry => {
        const [key, value] = entry;

        if( (value == '' || value == undefined) && key != 'id' )
        {
            //console.log(key, value);  
            checkParameter.parameter = false ;
            resData.status = "error";
            resData.data = "not have parameter ( "+key +" )"
        }
    });
    if(checkParameter == false)
    {
        //console.log(checkParameter)
        res.status(400).json(resData);
    }
    else{
        let sql = ` INSERT INTO public.tb_user_address(
            user_id, province_id, amphure_id, district_id, road, other, name_address)
            VALUES (  ${data.user_id}, ${data.province_id}, ${data.amphure_id}, 
                        '${data.district_id}', '${data.road}', '${data.other}', '${data.name_address}'); `;
        pool.query(
            sql, 
            (err, result) => {
                //console.log(err)
                if (err) {
                    console.log(err);  
                    
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

getPositionByUserid = (req, res, next) =>{
    // SELECT   tb_user_address.id,user_id , tb_province.name_th ,
    // tb_amphure.name_th , tb_district.name_th ,
    // tb_district.zip_code
    // ,road ,other, name_address
    // FROM public.tb_user_address
    // left join public.tb_province ON tb_province.id = tb_user_address.province_id
    // left join public.tb_amphure ON tb_amphure.id = tb_user_address.amphure_id
    // left join public.tb_district ON tb_district.id = tb_user_address.district_id
    // ORDER BY id ASC 
}

















module.exports = {
    getProvince,
    getAmphure,
    getDistrict,
    userAddPosition,
    getPositionByUserid
};