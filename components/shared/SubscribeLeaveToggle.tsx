'use client'

import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import React, { startTransition } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../ui/button'
import axios, { AxiosError } from 'axios'
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit'

interface SubscribeLeaveToggleProps {
  isSubscribed: boolean
  subredditId: string
  subredditName: string
}

const SubscribeLeaveToggle = ({
  isSubscribed,
  subredditId,
  subredditName,
}: SubscribeLeaveToggleProps) => {
  const { toast } = useToast()
  const { loginToast } = useCustomToasts()
  const router = useRouter()

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      }
      const { data } = await axios.post('/api/subreddit/subscribe', payload)
      return data as string
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast()
        }
      }
      return toast({
        title: 'There was a problem.',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess(data, variables, context) {
      startTransition(() => {
        // Refresh the current route and fetch new data from the server without
        // losing client-side browser or React state.
        router.refresh()
      })
      toast({
        title: 'Subscribed!',
        description: `You are now subscribed to r/${subredditName}`,
      })
    },
  })

  const { mutate: unsubscribe, isLoading: isUnsubLoading } = useMutation({
    mutationFn: async () => {},
    onError: () => {},
    onSuccess(data, variables, context) {},
  })

  return isSubscribed ? (
    <Button className='w-full mt-1 mb-4' isLoading={isUnsubLoading} onClick={() => unsubscribe()}>
      Leave community
    </Button>
  ) : (
    <Button className='w-full mt-1 mb-4' isLoading={isSubLoading} onClick={() => subscribe()}>
      Join to post
    </Button>
  )
}

export default SubscribeLeaveToggle
