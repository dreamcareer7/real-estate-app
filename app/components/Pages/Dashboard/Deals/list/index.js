import React from 'react'
import { connect } from 'react-redux'
import AgentTable from './agent-table'
import BackOfficeTable from './backoffice-table'
import cn from 'classnames'
import Header from './header'

class DealsDashboard extends React.Component {
  constructor(props) {
    super(props)

    const { isBackOffice } = props
    const activeFilters = {}

    // initial filters
    if (!isBackOffice) {
      activeFilters.status = (status, deal) => !deal.deleted_at
    }

    this.state = {
      activeFilters,
      searchBoxIsOpen: !isBackOffice,
      emptySearchPageIsOpen: false
    }
  }

  setSearchStatus(searchBoxIsOpen) {
    return this.setState({ searchBoxIsOpen })
  }

  showEmptySearchPage(emptySearchPageIsOpen) {
    return this.setState({ emptySearchPageIsOpen })
  }

  initialBOFilters(filters) {
    return this.setState({
      activeFilters: {
        ..._.omit(filters, 'searchResult')
      }
    })
  }

  initialAgentFilters(filters) {
    return this.setState({
      activeFilters: {
        status: (status, deal) => !deal.deleted_at,
        ..._.omit(filters, 'searchResult')
      }
    })
  }

  searchBOFilters() {
    return this.setState({
      activeFilters: { searchResult: true }
    })
  }

  /**
   *
   */
  setFilter(filters) {
    this.setState({
      activeFilters: {
        ...this.state.activeFilters,
        ...filters
      }
    })
  }

  render() {
    const {
      deals, isBackOffice, params, loadingDeals
    } = this.props
    const { activeFilters, searchBoxIsOpen, emptySearchPageIsOpen } = this.state
    const isWebkit = 'WebkitAppearance' in document.documentElement.style

    return (
      <div className="deals-list" data-simplebar={!isWebkit || null}>
        <Header
          activeFilterTab={params.filter}
          initialBOFilters={filters => this.initialBOFilters(filters)}
          initialAgentFilters={filters => this.initialAgentFilters(filters)}
          searchBOFilters={() => this.searchBOFilters()}
          searchBoxIsOpen={searchBoxIsOpen}
          setSearchStatus={searchBoxIsOpen => this.setSearchStatus(searchBoxIsOpen)}
          showEmptySearchPage={emptySearchPageIsOpen =>
            this.showEmptySearchPage(emptySearchPageIsOpen)
          }
          onFilterChange={filters => this.setFilter(filters)}
        />
        <i
          className={cn('fa fa-spinner fa-pulse fa-fw fa-3x spinner__loading', {
            hide_spinner: !loadingDeals
          })}
        />

        {!isBackOffice ? (
          <AgentTable
            deals={deals}
            tabName={params.filter || 'All'}
            searchBoxIsOpen={searchBoxIsOpen}
            emptySearchPageIsOpen={emptySearchPageIsOpen || loadingDeals}
            filters={activeFilters}
            isBackOffice={false}
          />
        ) : (
          <BackOfficeTable
            deals={deals}
            searchBoxIsOpen={searchBoxIsOpen}
            emptySearchPageIsOpen={emptySearchPageIsOpen || loadingDeals}
            filters={activeFilters}
            isBackOffice
          />
        )}
      </div>
    )
  }
}

export default connect(({ deals }) => ({
  deals: deals.list,
  isBackOffice: deals.backoffice,
  loadingDeals: deals.spinner
}))(DealsDashboard)
