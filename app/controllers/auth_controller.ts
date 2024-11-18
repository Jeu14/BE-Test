import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const loginSchema = schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
      password: schema.string({}, [rules.minLength(5), rules.required()]),
    })

    const data = await request.validate({ schema: loginSchema })

    try {
      const user = await User.findBy('email', data.email)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }

      const passwordMatches = await hash.verify(user.password, data.password)
      if (!passwordMatches) {
        return response.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, env.get('APP_KEY'), {
        expiresIn: '1h',
      })

      return response.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      })
    } catch (error) {
      return response.status(500).json({
        message: 'Error logging in',
        error: error.message,
      })
    }
  }
}
