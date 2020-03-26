import React, { useState } from 'react'
import { Helmet } from 'react-helmet'

import { useInfiniteScroll } from 'hooks/use-infinite-scroll'

import TemplatesList from 'components/TemplatesList'

import Layout from '../index'

import useTemplatesHistory from './useTemplatesHistory'
import EmptyState from './EmptyState'

const PAGE_SIZE = 12

function History() {
  const [limit, setLimit] = useState(PAGE_SIZE)
  const { templates, isLoading, deleteTemplate } = useTemplatesHistory()

  const loadNextPage = () => setLimit(limit => limit + PAGE_SIZE)

  useInfiniteScroll({
    accuracy: 400, // px
    onScrollBottom: loadNextPage
  })

  async function handleDelete(id) {
    await deleteTemplate(id)
  }

  const loadedTemplates = templates.slice(0, limit)

  return (
    <>
      <Helmet>
        <title>My Designs | Marketing | Rechat</title>
      </Helmet>

      <Layout
        render={() => (
          <TemplatesList
            pageSize={PAGE_SIZE}
            type="history"
            items={loadedTemplates}
            isLoading={isLoading}
            onDelete={handleDelete}
            emptyState={<EmptyState />}
          />
        )}
      />
    </>
  )
}

export default History
