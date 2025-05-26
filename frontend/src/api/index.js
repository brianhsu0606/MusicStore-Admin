import report from './report'
import member from './member'
import auth from './auth'
import profile from './profile'
import product from './product'
import order from './order'
import user from './user'
import cost from './cost'
import revenue from './revenue'

export default {
  ...report,
  ...member,
  ...auth,
  ...profile,
  ...product,
  ...order,
  ...user,
  ...cost,
  ...revenue,
}