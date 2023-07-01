import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
const maxWashingMachine = Env.get('MAX_WASHINGMACHINE', 10)

export default class CoinValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    coin: schema.number([rules.unsigned()]),
    machineNumber: schema.number([rules.unsigned(), rules.range(1, maxWashingMachine)]),
  })

  public messages: CustomMessages = {
    // 'machineNumber.unsigned': 'Define machineNumber as valid numbers[1-10]',
    // 'machineNumber.range': 'Define machineNumber as valid numbers[1-10]',
  }
}
