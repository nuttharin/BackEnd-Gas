class Gas {
  constructor(serialNumber, pressure, dateTime) {
    this.serialNumber = serialNumber ;
    this.pressure= pressure ;
    this.dateTime = dateTime ;
  }
}

  
class IoTData {
  constructor(serialNumber,id,modifyDate,lat,lon) {
    this.id = id;
    this.serialNumber = serialNumber ;
    this.modifyDate = modifyDate ;
    this.lat = lat ;
    this.lon = lon ;
  }
}

class IoT {
  constructor(serialNumber, user_id ,id,createDate,modifyDate,lat,lon) {
    this.id = id;
    this.serialNumber = serialNumber ;
    this.user_id = user_id ;
    this.createDate = createDate ;
    this.modifyDate = modifyDate ;
    this.lat = lat ;
    this.lon = lon ;
  }
}

module.exports = {
    Gas,
    IoT,
    IoTData
}