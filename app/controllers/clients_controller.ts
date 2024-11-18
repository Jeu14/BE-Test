import type { HttpContext } from '@adonisjs/core/http'

import Client from '#models/client'
import { rules, schema } from '@adonisjs/validator'

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
}