'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const Bill = use('App/Models/Bill')

class User extends Model {
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  /**
   * Return the user's bank accounts.
   *
   * @method bankAccounts
   *
   * @return {Object}
   */
  bankAccounts () {
    return this.hasMany('App/Models/UserBankAccount')
  }

  async accessToken (bankId) {
    const bankAccount = await this.bankAccounts().where('bank_id', bankId).first()
    if (!bankAccount) {
      return false
    }

    return bankAccount.access_token
  }

  /**
   * Return the user's bills.
   *
   * @method bills
   *
   * @return {Object}
   */
  bills () {
    return this.hasMany('App/Models/Bill')
  }

  /**
   * Return the user's bills' transactions.
   *
   * @method billTransactions
   *
   * @return {Object}
   */
  billTransactions () {
    return this.hasMany('App/Models/BillTransaction')
  }

  /**
   * Return the user's transactions.
   *
   * @method transactions
   *
   * @return {Object}
   */
  transactions () {
    return this.hasMany('App/Models/Transaction')
  }
}

module.exports = User
