import { Draft } from 'immer'
import { QueryClient } from 'react-query'

import { updateCacheActions, UpdateCachePromise } from '@app/utils/react-query'

import { allList } from '../query-keys/enrollment'

export async function updateCacheAllList(
  queryClient: QueryClient,
  superCampaignId: UUID,
  enrollments: Omit<ISuperCampaignEnrollmentInput, 'tags'>[],
  modifier: (
    enrollment: Draft<ISuperCampaignEnrollment<'user' | 'brand'>>
  ) => void
): UpdateCachePromise {
  return updateCacheActions<ISuperCampaignEnrollment<'user' | 'brand'>[]>(
    queryClient,
    allList(superCampaignId),
    prevEnrollments =>
      prevEnrollments.forEach(prevEnrollment => {
        const found = !!enrollments.find(
          item =>
            item.user === prevEnrollment.user.id &&
            item.brand === prevEnrollment.brand.id
        )

        if (!found) {
          return
        }

        modifier(prevEnrollment)
      })
  )
}
