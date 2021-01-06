const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const token_secret = process.env.ACCESS_TOKEN_JWT_SECRET ;
const refresh_token_secret = process.env.ACCESS_REFRESHTOKEN_JWT_SECRET; 

// access token 1 day
// refresh token 1 year 
module.exports.generateToken = async (data) =>{
    return new Promise((resolve , reject) => {
        const payload = {
            username  : data.username ,
            user_id : data.id
        }
        const option = {
            expiresIn : "1d"
        };
        jwt.sign(payload , token_secret , option , (err ,token) => {
            if(err) reject(err);
            //console.log(token) ;
            resolve(token) ;

        })
    })
}

module.exports.verifyAccessToken = (req , res , next) => {
    if(!req.headers["authorization"]) {
        res.status(403).end();
    }
    const token = req.headers["authorization"]
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    };
   
    jwt.verify( token , token_secret , function(err ,payload){
        if(err){
            //console.log("err 2")
            resData.status = "error";
            resData.statusCode = 401 ; 
            resData.data = err.name + '('+ err.message +')' ;     
            res.status(401).json(resData).end();       
            //res.status(403).end();
            //console.log(err)
            // if(err.name === 'JsonWebTokenError') 
            // {               
            //     resData.data =  "Unauthorized";
            //     res.status(401).json(resData).end();
            // }
            // else {
            //     resData.data =  err.massage;
            //     res.status(401).json(resData).end();
            // }
        }
        else 
        {
            //console.log("auth 2")
            req.payload = payload ;
            next();
        }
    })
}

module.exports.generateRefreshToken = (data) =>{
    return new Promise((resolve , reject) => {
        const payload = {
            username  : data.username ,
            user_id : data.id
        }
        const option = {
            expiresIn : "1y"
        };
        jwt.sign(payload , refresh_token_secret , option , (err ,token) => {
            if(err) reject(err);
            //console.log(token) ;
            resolve(token) ;

        })
    })
}


verifyAccessRefreshToken = (refreshToken) => {
    return new Promise((resolve , reject)=>{
        jwt.verify(refreshToken , refresh_token_secret , (err , payload) => {
            // if(err){
            //     resolve(payload) ;
            // }
            // else{
            //     resolve(payload);
            // }
            resolve(payload);
        })
    })
}

module.exports.RefreshToken = async (req , res , next) => {
    
    let refreshToken = req.body.refreshToken ;
    let resData = {
        status : "",
        statusCode : "",
        data : ""
    };
    if(!refreshToken) {
        resData.status = "error";
        resData.statusCode = 200 ;
        resData.data = "not have parameter ( refreshToken )";    
        res.status(200).json(resData);
    }
    else {
        let dataToken = await verifyAccessRefreshToken(refreshToken) ;
        if(!dataToken)
        {
            resData.status = "error";
            resData.statusCode = 200 ;
            resData.data = "refreshToken invalid";    
            res.status(200).json(resData);
        }
        else {
            //console.log(dataToken);
            let dataGen = {
                username : dataToken.username,
                id : dataToken.id
            }
            let accessToken = await this.generateToken(dataGen);
            let refreshToken = await this.generateRefreshToken(dataGen);

            resData.status = "success";
            resData.statusCode = 201 ;
            resData.data = {
                accessToken : accessToken,
                refreshToken : refreshToken
            };    
            res.status(200).json(resData);
        }
    }
}