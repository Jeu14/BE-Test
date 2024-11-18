import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password'])

    try {
      const hashedPassword = await hash.make(data.password)
      data.password = hashedPassword

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
