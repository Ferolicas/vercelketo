import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error('Faltan variables de entorno de Sanity');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-06-09',
  useCdn: false,
});

const builder = imageUrlBuilder(client);

export function urlFor(source: unknown) {
  return builder.image(source as { asset: { _ref: string; _type: string } });
}