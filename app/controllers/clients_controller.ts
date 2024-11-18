import type { HttpContext } from '@adonisjs/core/http'

import Client from '#models/client'
import { rules, schema } from '@adonisjs/validator'
import Sale from '#models/sale'

export default class ClientsController {
  public async store({ request, response }: HttpContext) {
    const validationSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      cpf: schema.string({}, [rules.required(), rules.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
      user_id: schema.number([rules.required()]),
    })

    const data = await request.validate({ schema: validationSchema })

    const existingClient = await Client.findBy('cpf', data.cpf)
    if (existingClient) {
      return response.status(400).json({ message: 'Client CPF already exists' })
    }

    try {
      const client = await Client.create(data)

      return response.status(201).json({
        message: 'Client registered successfully',
        id: client.id,
        name: client.name,
        cpf: client.cpf,
        user_id: client.userId,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error creating client',
        error: error.message,
      })
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const clientList = await Client.query()
        .select('id', 'name', 'cpf', 'user_id')
        .orderBy('id', 'asc')

      return response.status(200).json(clientList)
    } catch (error) {
      return response.status(400).json({
        message: 'Error listing clients',
        error: error.message,
      })
    }
  }

  public async show({ params, request, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)

      const month = request.input('month')
      const year = request.input('year')

      let salesQuery = Sale.query().where('client_id', client.id).orderBy('date', 'desc')

      if (month && year) {
        salesQuery = salesQuery.whereRaw('MONTH(date) = ? AND YEAR(date) = ?', [month, year])
      }

      const sales = await salesQuery

      return response.status(200).json({
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          user_id: client.userId,
        },
        sales: sales.map((sale) => ({
          id: sale.id,
          quantity: sale.quantity,
          unit_price: sale.unitPrice,
          total_price: sale.totalPrice,
          date: sale.date,
        })),
      })
    } catch (error) {
      return response.status(404).json({
        message: 'Client not found',
        error: error.message,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)

      const clientSchema = schema.create({
        name: schema.string({ trim: true }, [rules.required(), rules.minLength(3)]),
        cpf: schema.string({ trim: true }, [
          rules.required(),
          rules.regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
        ]),
      })

      const data = await request.validate({ schema: clientSchema })

      const existingClient = await Client.query()
        .where('cpf', data.cpf)
        .whereNot('id', params.id)
        .first()

      if (existingClient) {
        return response.status(400).json({
          message: 'Client CPF already exists',
        })
      }

      client.name = data.name
      client.cpf = data.cpf

      await client.save()

      return response.status(200).json({
        message: 'Client updated successfully',
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          user_id: client.userId,
        },
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error updating client',
        error: error.message,
      })
    }
  }
}
