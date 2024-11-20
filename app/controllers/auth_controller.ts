import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import { rules, schema } from '@adonisjs/validator'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const loginSchema = schema.create({
      email: schema.string({}, [rules.email(), rules.required()]),
      password: schema.string({}, [rules.minLength(5), rules.required()]),
    })

    const data = await request.validate({ schema: loginSchema })

    try {
      const user = await User.verifyCredentials(data.email, data.password)
      const token = await User.accessTokens.create(user)
      return {
        type: 'Bearer',
        token: token.value?.release(),
      }
    } catch (err) {
      return response.unauthorized()
    }
  }
}
