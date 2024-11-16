import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Address from './address.js'
import Phone from './phone.js'
import Sale from './sale.js'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare cpf: string

  @column()
  declare userId: number

  @belongsTo(() => User)
  public user!: BelongsTo<typeof User> 

  @hasMany(() => Address)
  public addresses!: HasMany<typeof Address> 

  @hasMany(() => Phone)
  public phones!: HasMany<typeof Phone>

  @hasMany(() => Sale)
  public sales!: HasMany<typeof Sale>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}