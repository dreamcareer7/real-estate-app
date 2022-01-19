import { UseMutationResult, useQueryClient } from 'react-query'
import { ResponseError } from 'superagent'

import { useMutation, UseMutationOptions } from '@app/hooks/query'
import { UpdateCacheActions, updateCacheActions } from '@app/utils/react-query'
import uuid from '@app/utils/uuid'

import { enrollMeInSuperCampaign } from './enroll-me-in-super-campaign'
import { myList } from './query-keys/enrollment'

interface DataInput {
  superCampaignId: UUID
  tags: string[]
}

export type UseEnrollMeInSuperCampaign = UseMutationResult<
  ISuperCampaignEnrollment,
  ResponseError,
  DataInput,
  { cache: UpdateCacheActions }
>

export type UseEnrollMeInSuperCampaignOptions = Omit<
  UseMutationOptions<
    ISuperCampaignEnrollment,
    ResponseError,
    DataInput,
    { cache: UpdateCacheActions }
  >,
  'invalidates' | 'onMutate'
>

export function useEnrollMeInSuperCampaign(
  options?: UseEnrollMeInSuperCampaignOptions
): UseEnrollMeInSuperCampaign {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ superCampaignId, tags }) =>
      enrollMeInSuperCampaign(superCampaignId, tags),
    {
      ...options,
      notify: {
        onSuccess:
          options?.notify?.onSuccess ??
          'You have been participated in the campaign',
        onError:
          options?.notify?.onError ??
          'Something went wrong while participating the campaign'
      },
      onMutate: async ({ superCampaignId, tags }) => ({
        cache: await updateCacheActions<ISuperCampaignEnrollment[]>(
          queryClient,
          myList(),
          enrollments => {
            const currentTime = new Date().getTime() / 1000

            enrollments.push({
              id: uuid(),
              created_at: currentTime,
              updated_at: currentTime,
              notifications_enabled: false,
              super_campaign: superCampaignId,
              tags
            } as ISuperCampaignEnrollment)
          }
        )
      }),
      onError: (error, variables, context) => {
        context?.cache.revert()
        options?.onError?.(error, variables, context)
      },
      onSettled: (data, error, variables, context) => {
        context?.cache.invalidate()
        options?.onSettled?.(data, error, variables, context)
      }
    }
  )
}
