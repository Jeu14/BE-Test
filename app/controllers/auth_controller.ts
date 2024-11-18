import User from '#models/user'

import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'

export default class AuthController {
  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(404).json({ message: 'User not found' })
      }

      const passwordMatches = await hash.verify(user.password, password)
      if (!passwordMatches) {
        return response.status(401).json({ message: 'Invalid credentials' })
      }

      const token = jwt.sign({ id: user.id, email: user.email }, 'SECRET_KEY', {
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
