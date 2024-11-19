import type { HttpContext } from '@adonisjs/core/http'

import Product from '#models/product'
import { rules, schema } from '@adonisjs/validator'

export default class ProductsController {
  public async store({ request, response }: HttpContext) {
    const productSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      description: schema.string({}, [rules.required()]),
      price: schema.number([rules.required(), rules.unsigned()]),
    })

    const data = await request.validate({ schema: productSchema })

    if (data.price <= 0) {
      return response.status(400).json({
        message: 'Price must be greater than zero',
      })
    }

    try {
      const product = await Product.create(data)
      return response.status(201).json({
        message: 'Product registered successfully',
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
        },
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error registering the product',
        error: error.message,
      })
    }
  }

  public async index({ response }: HttpContext) {
    try {
      const products = await Product.query()
        .select('id', 'name', 'description', 'price')
        .orderBy('id', 'asc')

      return response.status(200).json(products)
    } catch (error) {
      return response.status(500).json({
        message: 'Error searching for products',
        error: error.message,
      })
    }
  }
}
