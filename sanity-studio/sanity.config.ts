// sanity.config.ts

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
// --- CORRECCIÓN CLAVE: La ruta ahora es explícita al archivo index.ts ---
import {schemaTypes} from './schemaTypes/index'

export default defineConfig({
  name: 'default',
  title: 'Planeta Keto Web', // Puedes poner el nombre que quieras aquí

  projectId: 'nfqa4osj', // Tu Project ID
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    // Ahora solo necesitamos esta línea, ya que nuestro index.ts ya exporta todo
    types: schemaTypes,
  },
})