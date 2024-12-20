import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'
import { DateTime } from 'luxon'

import Product from '#models/product'

export default class ProductsController {
  public async store({ request, response }: HttpContext) {
    const productSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      description: schema.string({}, [rules.required()]),
      price: schema.number([rules.required(), rules.unsigned()]),
      stock: schema.number([rules.required(), rules.unsigned()]),
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
          stock: product.stock,
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
        .whereNull('deletedAt')
        .select('id', 'name', 'description', 'price', 'stock')
        .orderBy('name', 'asc')

      return response.status(200).json(products)
    } catch (error) {
      return response.status(500).json({
        message: 'Error searching for products',
        error: error.message,
      })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const product = await Product.query().where('id', params.id).andWhereNull('deletedAt').first()

      if (!product) {
        return response.status(404).json({
          message: 'Product not found',
        })
      }

      return response.status(200).json({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error searching for product',
        error: error.message,
      })
    }
  }

  public async update({ params, request, response }: HttpContext) {
    try {
      const updateProductSchema = schema.create({
        name: schema.string.optional({}, [rules.maxLength(255)]),
        description: schema.string.optional({}, [rules.maxLength(500)]),
        price: schema.number.optional([rules.unsigned()]),
        stock: schema.number.optional([rules.unsigned()]),
      })

      const data = await request.validate({ schema: updateProductSchema })

      const product = await Product.find(params.id)
      if (!product) {
        return response.status(404).json({
          message: 'Product not found',
        })
      }

      product.merge(data)
      await product.save()

      return response.status(200).json({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
      })
    } catch (error) {
      return response.status(400).json({
        message: 'Error updating product',
        error: error.message,
      })
    }
  }

  public async delete({ params, response }: HttpContext) {
    try {
      const product = await Product.find(params.id)
      if (!product) {
        return response.status(404).json({ message: 'Product not found' })
      }

      if (product.deletedAt) {
        return response.status(400).json({ message: 'Product has already been deleted' })
      }

      product.deletedAt = DateTime.now()
      await product.save()

      return response.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      return response.status(500).json({
        message: 'Error deleting product',
        error: error.message,
      })
    }
  }
}
