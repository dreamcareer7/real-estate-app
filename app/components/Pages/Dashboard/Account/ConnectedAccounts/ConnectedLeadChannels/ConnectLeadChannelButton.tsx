import { useState } from 'react'

import { Box, Button, CircularProgress } from '@material-ui/core'
import { mdiHelpCircleOutline } from '@mdi/js'

import useNotify from '@app/hooks/use-notify'
import { muiIconSizes, SvgIcon } from '@app/views/components/SvgIcons'

import { useCreateLeadChannelMutation } from './queries/use-create-lead-channel-mutation'

interface Props {
  activeBrandId?: UUID
  isFetching: boolean
}

export function ConnectLeadChannelButton({ activeBrandId, isFetching }: Props) {
  const [isWorking, setIsWorking] = useState(false)
  const notify = useNotify()

  const { mutateAsync } = useCreateLeadChannelMutation(activeBrandId)

  const handleConnect = async () => {
    if (!activeBrandId) {
      return
    }

    try {
      setIsWorking(true)

      await mutateAsync({
        sourceType: 'Zillow'
      })
    } catch (e) {
      notify({
        status: 'error',
        message: 'Something went wrong. Please try again.'
      })
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <Box display="flex" alignItems="center">
      <Box mr={1}>
        <Button
          size="small"
          href="https://help.rechat.com/guides/crm/connect-to-zillow"
          target="_blank"
          startIcon={
            <SvgIcon path={mdiHelpCircleOutline} size={muiIconSizes.small} />
          }
        >
          How to connect to Zillow
        </Button>
      </Box>

      <Button
        size="small"
        variant="outlined"
        onClick={handleConnect}
        startIcon={
          isWorking ? <CircularProgress size={20} color="inherit" /> : null
        }
        disabled={isWorking || isFetching}
      >
        Connect Zillow account
      </Button>
    </Box>
  )
}
