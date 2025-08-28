import category from './category'
import recipe from './recipe'
import comment from './comment'
import product from './product'
import service from './service'
import blogPost from './blogPost'
import forumPost from './forumPost'
import affiliateList from './affiliateList'

export const schemaTypes = [
  // Contenido principal
  category,
  recipe,
  comment,
  
  // Productos y servicios
  product,
  service,
  affiliateList,
  
  // Blog y foro
  blogPost,
  forumPost,
]