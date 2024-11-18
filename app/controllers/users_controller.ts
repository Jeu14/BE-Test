import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async store({ request, response }: HttpContext) {
    const data = request.only(['email', 'password'])

    try {
      const user = await User.create(data)
      return response.status(201).json(user)
    } catch (error) {
      return response.status(400).json({ message: 'Erro ao criar o usuário', error: error.message })
    }
  }
}
