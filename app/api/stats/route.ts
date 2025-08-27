import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export async function GET() {
  try {
    // Get all the stats in parallel
    const [
      totalRecipes,
      totalCategories,
      totalProducts,
      totalServices,
      totalBlogPosts,
      totalForumPosts,
      categories,
      topRatedRecipes,
      recentRecipes
    ] = await Promise.all([
      // Total counts
      client.fetch(`count(*[_type == "recipe"])`),
      client.fetch(`count(*[_type == "category"])`),
      client.fetch(`count(*[_type == "product"])`),
      client.fetch(`count(*[_type == "service"])`),
      client.fetch(`count(*[_type == "blogPost"])`),
      client.fetch(`count(*[_type == "forumPost"])`),

      // Categories with recipe counts
      client.fetch(`
        *[_type == "category"]{
          name,
          icon,
          "recipeCount": count(*[_type == "recipe" && references(^._id)])
        } | order(recipeCount desc)
      `),

      // Top rated recipes
      client.fetch(`
        *[_type == "recipe" && averageRating > 0] | order(averageRating desc, ratingsCount desc) [0...5] {
          name,
          averageRating,
          ratingsCount
        }
      `),

      // Recent recipes (last 7 days)
      client.fetch(`
        count(*[_type == "recipe" && dateTime(_createdAt) > dateTime(now()) - 86400*7])
      `)
    ]);

    // Calculate averages
    const allRecipeRatings = await client.fetch(`
      *[_type == "recipe" && averageRating > 0]{
        averageRating,
        ratingsCount
      }
    `);

    let totalRatingsSum = 0;
    let totalRatingsCount = 0;
    let weightedRatingSum = 0;

    allRecipeRatings.forEach((recipe: any) => {
      totalRatingsCount += recipe.ratingsCount;
      weightedRatingSum += recipe.averageRating * recipe.ratingsCount;
      totalRatingsSum += recipe.ratingsCount;
    });

    const avgRating = totalRatingsSum > 0 ? weightedRatingSum / totalRatingsSum : 0;

    // Get recent activity
    const recentComments = await client.fetch(`
      count(*[_type == "forumReply" && dateTime(_createdAt) > dateTime(now()) - 86400*7])
    `);

    const recentRatings = await client.fetch(`
      count(*[_type == "recipe" && dateTime(_updatedAt) > dateTime(now()) - 86400*7])
    `);

    const stats = {
      totalRecipes,
      totalCategories,
      totalComments: 0, // We don't have a comments system yet
      totalProducts,
      totalServices,
      totalBlogPosts,
      totalForumPosts,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings: totalRatingsSum,
      recentActivity: {
        newRecipes: recentRecipes,
        newComments: recentComments,
        newRatings: recentRatings
      },
      topCategories: categories.map((cat: any) => ({
        name: cat.name,
        count: cat.recipeCount,
        icon: cat.icon || '🍽️'
      })),
      topRatedRecipes: topRatedRecipes.map((recipe: any) => ({
        name: recipe.name,
        rating: Math.round(recipe.averageRating * 10) / 10,
        totalRatings: recipe.ratingsCount
      }))
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}