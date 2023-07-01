import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WashingModel from 'App/Models/Washing'
import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import { LineNotify } from 'App/Services/LineNotify'
import CoinValidator from 'App/Validators/CoinValidator'
const coinPerWashing = Env.get('COIN_PER_WASHING')

export default class WashingsController {
  public async index({ response }: HttpContextContract) {
    try {
      const washing = await WashingModel.query()
      return response.ok({ data: washing })
    } catch (error) {
      console.log('Error: index', error)
      return response.internalServerError({ message: 'Internal server.' })
    }
  }
  public async show({ request, response }: HttpContextContract) {
    try {
      const machineNumber = request.param('id')
      const washing = await WashingModel.findBy('machine_number', machineNumber)
      if (!washing) {
        return response.ok({ message: `MachineNumber[${machineNumber}] is available` })
      }
      return response.ok({ data: washing })
    } catch (error) {
      console.log('Error: show', error)
      return response.internalServerError({ message: 'Internal server.' })
    }
  }
  public async create({ request, response }: HttpContextContract) {
    try {
      try {
        await request.validate(CoinValidator)
      } catch (error) {
        return response.unprocessableEntity(error)
      }
      const data = request.only(['machineNumber', 'coin'])
      const washing = await WashingModel.findBy('machine_number', data.machineNumber)
      if (washing) {
        return response.unprocessableEntity({
          message: `Washing machine number ${data.machineNumber} has been used`,
        })
      }
      if (data.coin !== coinPerWashing) {
        return response.unprocessableEntity({ message: `Please insert ${coinPerWashing} coin` })
      }
      // 1Hr
      const completeDateTime = DateTime.now().plus({ hour: 1 })
      const alertDateTime = completeDateTime.minus({ minute: 1 })
      const durationCompleteTime = completeDateTime.diff(DateTime.now()).toObject()
      const durationAlertTime = alertDateTime.diff(DateTime.now()).toObject()

      // Set timeout for LineNotify and Delete Washing when complete washing
      setTimeout(() => {
        LineNotify(data.machineNumber, 'has 1 minute timeleft to complete')
      }, durationAlertTime.milliseconds)
      setTimeout(async () => {
        LineNotify(data.machineNumber, 'has complete washing')
        const washing = await WashingModel.findByOrFail('machine_number', data.machineNumber)
        await washing.delete()
      }, durationCompleteTime.milliseconds)

      const result = await WashingModel.create({
        machine_number: data.machineNumber,
        complete_at: completeDateTime,
      })
      return response.created({ data: result })
    } catch (error) {
      console.log('Error: create washing', error)
      return response.internalServerError({ message: 'Internal server.' })
    }
  }

  public async destroy({ request, response }: HttpContextContract) {
    try {
      const machineNumber = request.param('id')
      const washing = await WashingModel.findBy('machine_number', machineNumber)
      if (!washing) {
        return response.notFound({ message: `Machine number ${machineNumber} is available` })
      }
      await washing.delete()
      return response.noContent()
    } catch (error) {
      console.log('Error: delete washing', error)
      return response.internalServerError({ message: 'Internal server.' })
    }
  }
}
