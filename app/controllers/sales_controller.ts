import type { HttpContext } from '@adonisjs/core/http'

import Client from '#models/client'
import Product from '#models/product'
import Sale from '#models/sale'

export default class SalesController {
  public async store({ request, response }: HttpContext) {
    const { quantity, client_id, product_id } = request.only([
      'quantity',
      'unit_price',
      'client_id',
      'product_id',
    ])

    try {
      const client = await Client.find(client_id)
      if (!client) {
        return response.status(404).json({ message: 'Client not found' })
      }

      const product = await Product.find(product_id)
      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }

      const unit_price = product.price
      const totalPrice = unit_price * quantity

      const sale = await Sale.create({
        quantity,
        unitPrice: unit_price,
        totalPrice,
        clientId: client_id,
        productId: product_id,
      })

      return response.status(201).json({
        message: 'Sale registered successfully!',
        sale: {
          id: sale.id,
          quantity: sale.quantity,
          unit_price: sale.unitPrice,
          total_price: sale.totalPrice,
          client_id: sale.clientId,
          product_id: sale.productId,
          date: sale.date,
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error registering sale',
        error: error.message,
      })
    }
  }
}
