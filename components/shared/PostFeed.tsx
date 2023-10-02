'use client'

import React from 'react'
import { INFINITE_SCROLL_PAGINATION_RESULTS } from '@/config'
import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { ExtendedPost } from '@/types/db'
import { useIntersection } from '@mantine/hooks'
import Post from './Post'

interface PostFeedProps {
  initialPosts: ExtendedPost[]
  subredditName?: string
}

const PostFeed = ({ initialPosts, subredditName }: PostFeedProps) => {
  const lastPostRef = useRef<HTMLElement>(null)

  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  })

  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ['infiniti-query'],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/post?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subredditName ? `&subredditName=${subredditName}` : '')
      const { data } = await axios.get(query)
      return data as ExtendedPost[]
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialPosts], pageParams: [1] },
    }
  )

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts

  return (
    <ul className='flex flex-col col-span-2 space-y-6'>
      {posts.map((post, index) => {
        const votesAmount = post.votes.reduce((acc, vote) => {
          if (vote.type === 'UP') {
            return acc + 1
          } else if (vote.type === 'DOWN') {
            return acc - 1
          } else {
            return acc
          }
        }, 0)

        const currentVote = post.votes.find((vote) => vote.userId === session?.user.id)

        if (index === posts.length - 1) {
          // Add a ref to the last post in the list
          return (
            <li key={post.id} ref={ref}>
              <Post post={post} subredditName={post.subreddit.name} />
            </li>
          )
        } else {
          return <Post post={post} subredditName={post.subreddit.name} />
        }
      })}
    </ul>
  )
}

export default PostFeed