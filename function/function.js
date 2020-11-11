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

funCalDistanceLatLon = async () =>{
    var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2)
            ; 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km  
        console.log("ระยะทาง : " + d);
        // if(parseInt(d) <= 0 )
        // {
        //     d = Math.ceil(d * 1000 )+ " M";
        // }
        // else
        // {
        //     d = d+"Km";
        // }    
        d = Math.ceil(d * 1000 )+ " M";
        console.log(d);
        return d
       
}

funCalDistanceLatLon2 = async () =>{
    var rlat1 = Math.PI * lat1 / 180
    var rlat2 = Math.PI * lat2 / 180
    var rlon1 = Math.PI * lon1 / 180
    var rlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var rtheta = Math.PI * theta / 180
    var dist = Math.sin(rlat1) * Math.sin(rlat2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.cos(rtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") {
    dist = dist * 1.609344
    }
    if (unit == "N") {
    dist = dist * 0.8684
    }
    // if(dist <= 0 )
    // {
    //     dist = dist * 1000 + "M";
    // }
    // else
    // {
    //     dist = dist+"Km";
    // }
    console.log("1----------" + dist)
    return dist
}
 
function deg2rad(deg) {
    return deg * (Math.PI/180)
}

//13.860396, 100.513604
//13.860674, 100.511575
module.exports = {
    funCheckParameter,
    funCheckParameterWithOutId,
    funHashString,
    funCheckBody,
    funCalDistanceLatLon,
    funCalDistanceLatLon2
    
}