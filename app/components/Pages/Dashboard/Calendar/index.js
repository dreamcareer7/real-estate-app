import React from 'react'
import { connect } from 'react-redux'
import { batchActions } from 'redux-batched-actions'
import { browserHistory } from 'react-router'
import moment from 'moment'
import _ from 'underscore'
import { Helmet } from 'react-helmet'

import { getStartRange, getEndRange, getSelectedDate } from 'reducers/calendar'

import { getCalendar, setDate, resetCalendar } from 'actions/calendar'

import {
  createDateRange,
  createPastRange,
  createFutureRange
} from 'models/calendar/helpers/create-date-range'

import PageHeader from 'components/PageHeader'
import DatePicker from 'components/DatePicker'
import ActionButton from 'components/Button/ActionButton'

import { Container, Menu, Trigger, Content } from 'components/SlideMenu'

import { CrmEvents } from './CrmEvents'

import {
  viewAs,
  getActiveTeamACL,
  allMembersOfTeam,
  getActiveTeam
} from '../../../../utils/user-teams'

import Export from './Export'
import CalendarTable from './Table'
import { MenuContainer, TableContainer } from './styled'

const LOADING_POSITIONS = {
  Top: 0,
  Bottom: 1,
  Middle: 2
}

const MENU_WIDTH = '19.5rem'

class CalendarContainer extends React.Component {
  state = {
    isMenuOpen: true,
    isOpenEventDrawer: false,
    selectedEvent: null,
    loadingPosition: LOADING_POSITIONS.Middle
  }

  componentDidMount() {
    const acl = getActiveTeamACL(this.props.user)

    if (!acl.includes('CRM')) {
      browserHistory.push('/dashboard/mls')
    }

    this.restartCalendar(this.props.selectedDate)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.list.length === 0 &&
      this.state.loadingPosition !== LOADING_POSITIONS.Middle
    ) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)
    }

    if (
      nextProps.viewAsUsers.length !== this.props.viewAsUsers.length ||
      !_.isEqual(nextProps.viewAsUsers, this.props.viewAsUsers)
    ) {
      this.restartCalendar(this.selectedDate, nextProps.viewAsUsers)
    }
  }

  /**
   * Web page (document) title
   * @returns {String} Title
   */
  get documentTitle() {
    return `Calendar: ${moment(this.props.selectedDate).format(
      'MMM DD'
    )} | Rechat`
  }

  getCalendar = async (
    startRange,
    endRange,
    viewAsUsers = this.props.viewAsUsers
  ) => {
    this.props.getCalendar(
      startRange,
      endRange,
      viewAsUsers.length === this.props.brandMembers.length ? [] : viewAsUsers
    )
  }

  /**
   * close/open side menu
   */
  toggleSideMenu = () =>
    this.setState(state => ({
      isMenuOpen: !state.isMenuOpen
    }))

  /**
   * open create task menu
   */
  openEventDrawer = () => this.setState({ isOpenEventDrawer: true })

  /**
   * close create task menu
   */
  closeEventDrawer = () =>
    this.setState({
      isOpenEventDrawer: false,
      selectedEvent: null
    })

  /**
   * sets calendar references
   */
  onTableRef = (refId, ref) => {
    this.refs = {
      ...this.refs,
      [refId]: ref
    }
  }

  /**
   * sets the loader position
   * @param { Number } position - the position
   */
  setLoadingPosition = position =>
    this.setState({
      loadingPosition: position
    })

  restartCalendar = async (selectedDate, viewAsUsers) => {
    const [newStartRange, newEndRange] = createDateRange(selectedDate, {
      range: 6
    })

    this.setLoadingPosition(LOADING_POSITIONS.Middle)

    this.props.resetCalendar()
    this.refs = {}

    batchActions([
      this.props.setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange, viewAsUsers)
    ])

    this.scrollIntoView(selectedDate)
  }

  handleDateChange = async selectedDate => {
    const { startRange, endRange, setDate } = this.props
    const [newStartRange, newEndRange] = createDateRange(selectedDate)
    const timestamp = moment(selectedDate)
      .utcOffset(0)
      .startOf('day')
      .format('X')

    // check the new range is inside current range or not
    if (timestamp >= startRange && timestamp <= endRange) {
      setDate(selectedDate)
      this.scrollIntoView(selectedDate, {
        behavior: 'smooth'
      })

      return false
    }

    // check range is completly outside the current range or not
    if (timestamp > endRange || timestamp < startRange) {
      return this.restartCalendar(selectedDate)
    }

    this.setLoadingPosition(LOADING_POSITIONS.Middle)
    this.scrollIntoView(selectedDate, {
      behavior: 'smooth'
    })

    batchActions([
      setDate(selectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])
  }

  onClickTask = selectedEvent =>
    this.setState(() => ({ selectedEvent }), this.openEventDrawer)

  handleEventChange = async (task, action) => {
    const { startRange, endRange } = this.props
    const timestamp = task.due_date

    const isInRange = timestamp >= startRange && timestamp <= endRange
    const isTaskUpdated = action === 'updated'
    const newSelectedDate = new Date(timestamp * 1000)

    this.closeEventDrawer()

    if (isInRange || isTaskUpdated) {
      this.setLoadingPosition(LOADING_POSITIONS.Middle)

      batchActions([
        this.props.resetCalendar(),
        this.props.setDate(newSelectedDate),
        await this.getCalendar(startRange, endRange)
      ])

      this.scrollIntoView(newSelectedDate)
    }
  }

  scrollIntoView = (date, options = {}, attempts = 0) => {
    const refId = moment(date).format('YYYY-MM-DD')

    if (!this.refs[refId] && attempts < 6) {
      setTimeout(() => {
        this.scrollIntoView(date, options, attempts + 1)
      }, 500)

      return false
    }

    this.refs[refId] &&
      this.refs[refId].scrollIntoView({
        behavior: options.behavior || 'instant',
        block: 'start'
      })
  }

  loadPreviousItems = async () => {
    const { startRange } = this.props

    if (this.props.isFetching || _.isEmpty(this.props.calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Top)

    const [newStartRange, newEndRange] = createPastRange(startRange)
    const newSelectedDate = new Date(startRange * 1000)

    batchActions([
      this.props.setDate(newSelectedDate),
      await this.getCalendar(newStartRange, newEndRange)
    ])

    this.scrollIntoView(newSelectedDate)
  }

  loadNextItems = async () => {
    const { endRange, isFetching, calendarDays } = this.props

    if (isFetching || _.isEmpty(calendarDays)) {
      return false
    }

    this.setLoadingPosition(LOADING_POSITIONS.Bottom)
    this.getCalendar(...createFutureRange(endRange))
  }

  get SelectedRange() {
    const { startRange, endRange } = this.props
    const offset = new Date().getTimezoneOffset() * 60

    const range = {
      from: new Date((~~startRange + offset) * 1000),
      to: new Date((~~endRange + offset) * 1000)
    }

    return {
      range
    }
  }

  render() {
    const { isMenuOpen, loadingPosition } = this.state
    const { selectedDate, isFetching } = this.props

    return (
      <React.Fragment>
        <Helmet>
          <title>{this.documentTitle}</title>
        </Helmet>
        <Container isOpen={isMenuOpen}>
          <Menu isOpen={isMenuOpen} width={MENU_WIDTH}>
            <MenuContainer>
              <DatePicker
                selectedDate={selectedDate}
                onChange={this.handleDateChange}
                // modifiers={this.SelectedRange}
              />

              <Export />
            </MenuContainer>
          </Menu>

          <Content menuWidth={MENU_WIDTH} isSideMenuOpen={isMenuOpen}>
            <PageHeader>
              <PageHeader.Title showBackButton={false}>
                <Trigger
                  isExpended={isMenuOpen}
                  onClick={this.toggleSideMenu}
                />
                <PageHeader.Heading>Calendar</PageHeader.Heading>
              </PageHeader.Title>

              <PageHeader.Menu>
                <ActionButton onClick={this.openEventDrawer}>
                  Add Event
                </ActionButton>
              </PageHeader.Menu>
            </PageHeader>
            <TableContainer>
              <CalendarTable
                positions={LOADING_POSITIONS}
                selectedDate={selectedDate}
                isFetching={isFetching}
                loadingPosition={loadingPosition}
                onScrollTop={this.loadPreviousItems}
                onScrollBottom={this.loadNextItems}
                onSelectTask={this.onClickTask}
                onRef={this.onTableRef}
              />
            </TableContainer>
          </Content>

          <CrmEvents
            isOpenEventDrawer={this.state.isOpenEventDrawer}
            selectedEvent={this.state.selectedEvent}
            user={this.props.user}
            onEventChange={this.handleEventChange}
            onCloseEventDrawer={this.closeEventDrawer}
          />
        </Container>
      </React.Fragment>
    )
  }
}

function mapStateToProps({ user, calendar }) {
  return {
    user,
    list: calendar.list,
    isFetching: calendar.isFetching,
    selectedDate: getSelectedDate(calendar),
    calendarDays: calendar.byDay,
    viewAsUsers: viewAs(user),
    startRange: getStartRange(calendar),
    endRange: getEndRange(calendar),
    brandMembers: allMembersOfTeam(getActiveTeam(user))
  }
}

export default connect(
  mapStateToProps,
  {
    getCalendar,
    setDate,
    resetCalendar
  }
)(CalendarContainer)
