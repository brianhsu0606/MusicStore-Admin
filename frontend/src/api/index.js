import auth from './auth'
import profile from './profile'
import revenue from './revenue'
import product from './product'
import order from './order'
import member from './member'
import cost from './cost'
import user from './user'

export default {
  ...auth,
  ...profile,
  ...revenue,
  ...member,
  ...product,
  ...order,
  ...user,
  ...cost,
}