class BankDriver {
    constructor(id, driver_id, bank_id,bank_account , modidyDate,name_account) {
      this.id = id ;
      this.driver_id = driver_id ;
      this.bank_id = bank_id ;
      this.name_account = name_account ;
      this.bank_account = bank_account;
      this.modidyDate = modidyDate
    }
}

module.exports = {
    BankDriver
}

