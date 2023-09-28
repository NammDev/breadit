import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubredditSubscriptionValidator } from '@/lib/validators/subreddit'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    // check session
    const session = await getAuthSession()
    if (!session?.user) return new Response('Unauthorized', { status: 401 })

    // get data from client & test
    const body = await req.json()
    const { subredditId } = SubredditSubscriptionValidator.parse(body)

    // check if this user subscribe yet?
    const subscriptionExists = await db.subscription.findFirst({
      where: { subredditId, userId: session.user.id },
    })
    if (subscriptionExists) {
      return new Response('You are already subscribed to this subreddit!', { status: 400 })
    }

    // add user to subreddit (create subscription)
    await db.subscription.create({
      data: { subredditId, userId: session.user.id },
    })

    // give data to client
    return new Response(subredditId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    } else {
      return new Response('Could not subscribe to subreddit at this time. Please try later', {
        status: 500,
      })
    }
  }
}
