class User {
    constructor(id, fname, lname, type, createDate, modifyDate) {
        this.id = id ;
        this.fname= method2 ;
        this.lname = lname ;
        this.type = type ;
        this.createDate = createDate ;
        this.modifyDate = modifyDate ;
    }
}

class Position {
    constructor(id , user_id , province_id , amphure_id , district_id ,road ,other, name_address)
    {
        this.id = id;
        this.user_id = user_id;
        this.province_id = province_id ;
        this.amphure_id = amphure_id;
        this.district_id = district_id ;
        this.road = road;
        this.other = other;
        this.name_address = name_address;
    }
}

module.exports = {
    User,
    Position
}