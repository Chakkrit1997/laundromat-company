import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Washing extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public machine_number: number

  @column.dateTime()
  public complete_at: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
