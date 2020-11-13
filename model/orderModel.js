class CartData {
    constructor(cart_id, quality ,modifyDate) {
      this.cart_id = cart_id ;
      this.quality= quality ;     
      this.modifyDate = modifyDate ;    
 
    }
  }

class Cart {
  constructor(id ,user_id, quality,gas_id,modifyDate) {
    this.id = id ;
    this.user_id = user_id;
    this.gas_id = gas_id ; 
    this.quality= quality ;   
    this.modifyDate = modifyDate ;    
  }
}

class Order {
  constructor(id, user_id, priceall, createDate,modifyDate, receiveDate,send_type,payment_id,
    order_number, address_id,status,order,machine_id){
    this.id  = id ;
    this.user_id = user_id ;
    this.priceall = priceall ;
    this.createDate = createDate ;
    this.modifyDate = modifyDate ;
    //this.receiveDate = receiveDate ;
    this.send_type = send_type ;
    this.payment_id = payment_id ;
    this.order_number = order_number ;
    this.address_id = address_id ;
    this.order = order ;
    this.machine_id = machine_id ;

  }
}



  module.exports = {
      CartData ,
      Cart ,
      Order
  }