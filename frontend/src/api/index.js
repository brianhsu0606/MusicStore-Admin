import revenue from './revenue'
import member from './member'
import auth from './auth'
import profile from './profile'
import product from './product'
import order from './order'
import user from './user'
import cost from './cost'

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