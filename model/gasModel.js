class Gas {
    constructor(serialNumber, pressure, dateTime) {
      this.serialNumber = serialNumber ;
      this.pressure= pressure ;
      this.dateTime = dateTime ;
    }
  }

  
class IoT {
  constructor(serialNumber, user_id ) {
    this.serialNumber = serialNumber ;
    this.user_id = user_id ;

  }
}

module.exports = {
    Gas,
    IoT
}