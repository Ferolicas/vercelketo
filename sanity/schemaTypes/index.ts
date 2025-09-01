import category from './category'
import recipe from './recipe'
import comment from './comment'
import product from './product'
import service from './service'
import blogPost from './blogPost'
import forumPost from './forumPost'
import { amazonList } from './affiliateList'
import { clientes } from './clientes'
import { transaction } from './transaction'

export const schemaTypes = [
  // Contenido principal
  category,
  recipe,
  comment,
  
  // Productos y servicios
  product,
  service,
  amazonList,
  
  // Blog y foro
  blogPost,
  forumPost,
  
  // E-commerce y clientes
  clientes,
  transaction,
]