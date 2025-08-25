// sanity/schemaTypes/index.ts

import blockContent from './blockContent'
import category from './category'
import post from './post'
import author from './author'
import homePage from './homePage'
import comment from './comment'

export const schemaTypes = [
  // Documentos Principales
  post,
  author,
  category,
  homePage,
  comment,

  // Tipos de Objeto y Utilidades
  blockContent
]