import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

// import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const userSchema = schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
      password: schema.string({}, [rules.minLength(5), rules.required()]),
    })

    const data = await request.validate({ schema: userSchema })

    try {
      const user = await User.create(data)
      return response.status(201).json({
        id: user.id,
        email: user.email,
      })
    } catch (error) {
      return response.status(400).json({ message: 'Error creating user', error: error.message })
    }
  }
}
