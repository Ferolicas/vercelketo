import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    const amazonLists = await client.fetch(`
      *[_type == "amazonList"] | order(featured desc, createdAt desc) {
        _id,
        title,
        slug,
        description,
        amazonUrl,
        image{
          asset->{
            _id,
            url
          },
          alt
        },
        price,
        category,
        rating,
        reviewsCount,
        benefits,
        keyFeatures,
        featured,
        isKeto,
        createdAt
      }
    `)

    return NextResponse.json(amazonLists || [])
  } catch (error) {
    console.error('Error fetching Amazon lists:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Amazon lists' },
      { status: 500 }
    )
  }
}