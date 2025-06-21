import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {colorInput} from '@sanity/color-input'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'The Jar Co - E-commerce',
  projectId: 'gf16m01n',
  dataset: 'production',
  plugins: [
    structureTool(),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
  },
})