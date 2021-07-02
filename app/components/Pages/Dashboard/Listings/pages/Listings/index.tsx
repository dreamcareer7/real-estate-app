import { useState } from 'react'
import { WithRouterProps } from 'react-router'

import { Box } from '@material-ui/core'

import { useTitle } from 'react-use'

import PageLayout from '@app/views/components/GlobalPageLayout'
import LoadingContainer from '@app/views/components/LoadingContainer'

import SearchTextField from '../../components/SearchTextField'

import ListingsTabs from './ListingsTabs'
import ListingsList from './ListingsList'
import useListingsTabs from './use-listings-tabs'
import ListingsOpenHouseProvider from './ListingsOpenHouseProvider'

type ListingsProps = WithRouterProps<{ brandId?: UUID }, {}>

function Listings({ params }: ListingsProps) {
  useTitle('Listings | Rechat')

  const { tabs, tab } = useListingsTabs(params.brandId)
  const [search, setSearch] = useState('')

  return (
    <PageLayout position="relative" overflow="hidden">
      <PageLayout.Header title="Listings">
        <Box width="100%" maxWidth={360}>
          <SearchTextField onChange={setSearch} />
        </Box>
      </PageLayout.Header>
      <PageLayout.Main>
        {tab ? (
          <>
            <ListingsTabs tabs={tabs} value={tab.value} />
            <ListingsOpenHouseProvider>
              <ListingsList
                key={tab.value}
                brandId={tab.value}
                hasActions={tab.hasActions}
                search={search}
              />
            </ListingsOpenHouseProvider>
          </>
        ) : (
          <Box height="600px">
            <LoadingContainer
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: 0
              }}
            />
          </Box>
        )}
      </PageLayout.Main>
    </PageLayout>
  )
}

export default Listings
