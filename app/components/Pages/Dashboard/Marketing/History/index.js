import React from 'react'
import Flex from 'styled-flex-component'

import { getHistory } from 'models/instant-marketing/get-history'

import { Header } from '../components/PageHeader'
import { Loader } from '../components/Loader'

import { List } from './List'
import { ZeroState } from './ZeroState'

export default class History extends React.Component {
  state = {
    templates: [],
    isLoading: false
  }

  componentDidMount() {
    this.fetch()
  }

  fetch = async () => {
    try {
      this.setState({ isLoading: true })

      const templates = await getHistory()

      this.setState({
        isLoading: false,
        templates
      })
    } catch (error) {
      console.log(error)
      this.setState({ isLoading: false })
    }
  }

  renderContent = () => {
    if (this.state.isLoading) {
      return (
        <Flex center style={{ height: '100vh' }}>
          <Loader />
        </Flex>
      )
    }

    if (this.state.templates.length === 0) {
      return <ZeroState />
    }

    return (
      <List
        isLoading={this.state.isLoading}
        isSideMenuOpen={this.props.isSideMenuOpen}
        templates={this.state.templates}
      />
    )
  }

  render() {
    return (
      <div style={{ padding: '0 1.5rem' }}>
        <Header
          title="All My Designs"
          isSideMenuOpen={this.props.isSideMenuOpen}
          toggleSideMenu={this.props.toggleSideMenu}
        />
        {this.renderContent()}
      </div>
    )
  }
}
