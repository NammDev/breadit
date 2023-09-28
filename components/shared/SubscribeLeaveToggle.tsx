import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useMutation } from '@tanstack/react-query'
import { Button } from '../ui/button'

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
  const router = useRouter

  const { mutate: subscribe, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {},
    onError: () => {},
    onSuccess(data, variables, context) {},
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
