funCheckParameterWithOutId = async (data) => {
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

funCheckBody = async (data) =>{
    let dataKey = "" ;
    console.log(data)
    await Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        console.log(value)
        if( (value == '' || value == undefined) )
        {          
            console.log(dataKey)
            dataKey = key ;           
        }
    });
    return dataKey;
}

funHashString = async (str) =>{

}



module.exports = {
    funCheckParameter,
    funCheckParameterWithOutId,
    funHashString,
    funCheckBody
}