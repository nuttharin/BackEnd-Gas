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

funHashString = async (str) =>{

}



module.exports = {
    funCheckParameter,
    funCheckParameterWithOutId,
    funHashString
}