class User {
    constructor(id, name, password, idCard,email,phone, createDate, modifyDate,type) {
        this.id = id ;
        this.name= name ;
        this.password = password ;
        this.idCard = idCard ;
        this.email = email;
        this.phone = phone;        
        this.type = type ;
        // this.address = address;
        // this.province = province;
        // this.amphure = amphure;
        // this.district = district ;
        this.createDate = createDate ;
        this.modifyDate = modifyDate ;
    }
}

class Rider {
    constructor(id, name, password, idCard,email,phone, createDate, modifyDate){
        this.id = id ;
        this.name= name ;
        this.password = password ;
        this.idCard = idCard ;
        this.email = email;
        this.phone = phone;        
        this.createDate = createDate ;
        this.modifyDate = modifyDate ;
    }
}

class Order{
    constructor(id,user_id, address_id, type_delivery, order_gas, status, rider_id){
        this.id = id ;
        this.user_id = user_id;
        this.address_id = address_id;
        this.type_delivery = type_delivery;
        this.order_gas = order_gas;
        this.status = status;
        this.rider_id = rider_id;
    }
}

class Position {
    constructor(id  , province_id , amphure_id , district_id ,road ,other, name_address ,lat,lon)
    {
        this.id = id;
        // this.user_id = user_id;
        this.province_id = province_id ;
        this.amphure_id = amphure_id;
        this.district_id = district_id ;
        this.road = road;
        this.other = other;
        this.name_address = name_address;
        this.lat = lat ;
        this.lon = lon ;

    }
}

class PositionUserId {
    constructor(id , user_id , province_id , amphure_id , district_id ,road ,other, name_address ,lat,lon)
    {
        this.id = id;
        this.user_id = user_id;
        this.province_id = province_id ;
        this.amphure_id = amphure_id;
        this.district_id = district_id ;
        this.road = road;
        this.other = other;
        this.name_address = name_address;
        this.lat = lat ;
        this.lon = lon ;

    }
}

module.exports = {
    User,
    Rider,
    Position,
    PositionUserId,
    Order
}