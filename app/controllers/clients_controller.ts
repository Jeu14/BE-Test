import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

import Client from '#models/client'
import Sale from '#models/sale'
import Phone from '#models/phone'
import Address from '#models/address'

export default class ClientsController {
  public async store({ request,auth, response }: HttpContext) {
    const validationSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      cpf: schema.string({}, [rules.required(), rules.regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]),
      phone: schema.string({}, [rules.required(), rules.mobile()]),
      address: schema.object().members({
        street: schema.string({}, [rules.required()]),
        number: schema.string({}, [rules.required()]),
        city: schema.string({}, [rules.required()]),
        state: schema.string({}, [rules.required()]),
        zip_code: schema.string({}, [rules.required(), rules.regex(/^\d{5}-\d{3}$/)]),
        country: schema.string({}, [rules.required()]),
      }),
    })

    const data = await request.validate({ schema: validationSchema })

    const existingClient = await Client.findBy('cpf', data.cpf)
    if (existingClient) {
      return response.status(400).json({ message: 'Client CPF already exists' })
    }

    const user = await auth.authenticate()

    try {
      const client = await Client.create({
        name: data.name,
        cpf: data.cpf,
        userId: user.id,
      })

      await Phone.create({ number: data.phone, clientId: client.id })
      await Address.create({ ...data.address, clientId: client.id })

      return response.status(201).json({
        message: 'Client registered successfully',
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          phone: data.phone,
          address: data.address,
          user_id: client.userId,
        },
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
      const clients = await Client.query()
        .preload('phones')
        .preload('addresses')
        .select('id', 'name', 'cpf', 'user_id')
        .orderBy('id', 'asc')

      const clientList = clients.map((client) => ({
        id: client.id,
        name: client.name,
        cpf: client.cpf,
        phone: client.phones[0]?.number,
        address: client.addresses[0]
          ? `${client.addresses[0].street}, ${client.addresses[0].number} - ${client.addresses[0].city}`
          : null,
        userId: client.userId,
      }))

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
      const client = await Client.query()
        .where('id', params.id)
        .preload('phones')
        .preload('addresses')
        .firstOrFail()

      const month = request.input('month')
      const year = request.input('year')

      let salesQuery = Sale.query().where('client_id', client.id).orderBy('date', 'desc')

      if (month && year) {
        salesQuery = salesQuery.whereRaw('MONTH(date) = ? AND YEAR(date) = ?', [month, year])
      }

      const sales = await salesQuery

      const address = client.addresses[0]
        ? {
            id: client.addresses[0].id,
            street: client.addresses[0].street,
            number: client.addresses[0].number,
            city: client.addresses[0].city,
            state: client.addresses[0].state,
            zipCode: client.addresses[0].zipCode,
            country: client.addresses[0].country,
            clientId: client.addresses[0].clientId,
          }
        : null

      return response.status(200).json({
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          phone: client.phones[0]?.number,
          address: address,
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
      const client = await Client.query()
        .where('id', params.id)
        .preload('phones')
        .preload('addresses')
        .firstOrFail()

      const clientSchema = schema.create({
        name: schema.string({ trim: true }, [rules.required(), rules.minLength(3)]),
        cpf: schema.string({ trim: true }, [
          rules.required(),
          rules.regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
        ]),
        phone: schema.string({}, [rules.required(), rules.mobile()]),
        address: schema.object().members({
          street: schema.string({}, [rules.required()]),
          number: schema.string({}, [rules.required()]),
          city: schema.string({}, [rules.required()]),
          state: schema.string({}, [rules.required()]),
          zip_code: schema.string({}, [rules.required(), rules.regex(/^\d{5}-\d{3}$/)]),
          country: schema.string({}, [rules.required()]),
        }),
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

      client.merge({ name: data.name, cpf: data.cpf })
      await client.save()

      const phone = client.phones[0] || new Phone()
      phone.merge({ number: data.phone, clientId: client.id })
      await phone.save()

      const address = client.addresses[0] || new Address()
      address.merge({ ...data.address, clientId: client.id })
      await address.save()

      await client.save()

      return response.status(200).json({
        message: 'Client updated successfully',
        client: {
          id: client.id,
          name: client.name,
          cpf: client.cpf,
          phone: data.phone,
          address: data.address,
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

  public async delete({ params, response }: HttpContext) {
    try {
      const client = await Client.findOrFail(params.id)

      await client.delete()

      return response.status(200).json({
        message: 'Client and associated sales successfully deleted',
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error deleting client',
        error: error.message,
      })
    }
  }
}
