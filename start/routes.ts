import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const UsersController = () => import('#controllers/users_controller')
const AuthController = () => import('#controllers/auth_controller')
const ClientsController = () => import('#controllers/clients_controller')
const ProductsController = () => import('#controllers/products_controller')
const SalesController = () => import('#controllers/sales_controller')

router.post('/signup', [UsersController, 'store'])
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.post('/client/store', [ClientsController, 'store'])
    router.get('/client/index', [ClientsController, 'index'])
    router.get('/client/show/:id', [ClientsController, 'show'])
    router.put('/client/update/:id', [ClientsController, 'update'])
    router.delete('/client/delete/:id', [ClientsController, 'delete'])
  })
  .use(middleware.auth({ guards: ['api'] }))

router
  .group(() => {
    router.post('/product/store', [ProductsController, 'store'])
    router.get('/product/index', [ProductsController, 'index'])
    router.get('/product/show/:id', [ProductsController, 'show'])
    router.put('/product/update/:id', [ProductsController, 'update'])
    router.delete('/product/delete/:id', [ProductsController, 'delete'])
  })
  .use(middleware.auth({ guards: ['api'] }))

router.post('/sale/store', [SalesController, 'store']).use(middleware.auth({ guards: ['api'] }))
