import React from 'react'
import _ from 'underscore'

import Loading from '../../../../../Partials/Loading'
import { EditNoteDrawer } from '../../../../../../views/components/EditNoteDrawer'
import { EventDrawer } from '../../../../../../views/components/EventDrawer'
import { TourDrawer } from '../../../../../../views/components/tour/TourDrawer'
import { OpenHouseDrawer } from '../../../../../../views/components/open-house/OpenHouseDrawer'
import { setTime } from '../../../../../../utils/set-time'

import { Card } from '../styled'
import { NoteItem } from './NoteItem'
import { TourItem } from './TourItem'
import { EventItem } from './EventItem'
import { OpenHouseItem } from './OpenHouseItem'
import { EmptyState } from './EmptyState'
import { Container, Title } from './styled'

export class Timeline extends React.Component {
  state = {
    selectedNote: null,
    selectedEvent: null
  }

  onClickNote = selectedNote => this.setState({ selectedNote })

  closeEditNoteDrawer = () => this.setState({ selectedNote: null })

  closeEventDrawer = () => this.setState({ selectedEvent: null })

  onClickEvent = selectedEvent => this.setState({ selectedEvent })

  handleEditEvent = updatedEvent => {
    this.closeEventDrawer()
    this.props.editEventHandler(updatedEvent)
  }

  handleDeleteEvent = deletedEvent => {
    this.closeEventDrawer()
    this.props.deleteEventHandler(deletedEvent.id)
  }

  renderCRMTaskItem(key, task) {
    const _props = {
      defaultAssociation: this.props.defaultAssociation,
      editCallback: this.props.editEventHandler,
      key,
      onClick: this.onClickEvent,
      task
    }

    switch (task.task_type) {
      case 'Tour':
        return <TourItem {..._props} />
      case 'Open House':
        return <OpenHouseItem {..._props} />
      default:
        return <EventItem {..._props} />
    }
  }

  renderItems = month => (
    <React.Fragment>
      <Title>
        <b>{month.title}</b>
      </Title>
      <Card>
        {month.items.map(activity => {
          const key = `timeline_item_${activity.id}`

          if (activity.type === 'crm_task') {
            return this.renderCRMTaskItem(key, activity)
          }

          if (
            activity.type === 'contact_attribute' &&
            activity.attribute_type === 'note'
          ) {
            return (
              <NoteItem
                contact={this.props.contact}
                key={key}
                note={activity}
                onClick={this.onClickNote}
              />
            )
          }
        })}
      </Card>
    </React.Fragment>
  )

  renderCRMTaskItemsDrawer() {
    const { selectedEvent } = this.state

    if (!selectedEvent) {
      return null
    }

    const _props = {
      defaultAssociation: this.props.defaultAssociation,
      deleteCallback: this.handleDeleteEvent,
      isOpen: true,
      onClose: this.closeEventDrawer,
      submitCallback: this.handleEditEvent,
      user: this.props.user
    }

    const { id } = selectedEvent

    switch (selectedEvent.task_type) {
      case 'Tour':
        return <TourDrawer {..._props} tourId={id} />
      case 'Open House':
        return <OpenHouseDrawer {..._props} openHouseId={id} />
      default:
        return <EventDrawer {..._props} eventId={id} />
    }
  }

  render() {
    if (this.props.isFetching) {
      return <Loading />
    }

    if (this.props.items.length === 0) {
      return <EmptyState />
    }

    const todayEvents = []
    const upcomingEvents = []
    const pastEventsIndexedInMonths = {}

    this.props.items.forEach(item => {
      let date
      let { due_date } = item

      function getDateMonthAndYear(date) {
        date = new Date(date)

        const months = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ]

        const monthNumber = date.getMonth()
        const year = date.getFullYear()

        const index = `${monthNumber}_${year}`

        const title = `${months[monthNumber]} ${year}`

        return {
          index,
          title
        }
      }

      if (due_date) {
        due_date *= 1000

        if (isToday(due_date)) {
          return todayEvents.push(item)
        }

        if (due_date > new Date().getTime()) {
          return upcomingEvents.push(item)
        }

        date = new Date(due_date)
      } else {
        const createdAt = item.created_at * 1000

        if (isToday(createdAt)) {
          return todayEvents.push(item)
        }

        date = new Date(createdAt)
      }

      const monthAndYear = getDateMonthAndYear(date)

      if (pastEventsIndexedInMonths[monthAndYear.index]) {
        pastEventsIndexedInMonths[monthAndYear.index].items.push(item)
      } else {
        pastEventsIndexedInMonths[monthAndYear.index] = {
          title: monthAndYear.title,
          items: [item]
        }
      }
    })

    let sortedPastEvents = []

    if (Object.keys(pastEventsIndexedInMonths).length > 0) {
      sortedPastEvents = Object.keys(pastEventsIndexedInMonths).sort((a, b) => {
        const [aMonth, aYear] = a.split('_')
        const [bMonth, bYear] = b.split('_')

        if (aYear === bYear) {
          return bMonth - aMonth
        }

        return bYear - aYear
      })
    }

    return (
      <div>
        {upcomingEvents.length > 0 && (
          <Container id="upcoming_events" key="upcoming_events">
            {this.renderItems({
              title: 'Upcoming Events',
              items: upcomingEvents.sort((a, b) => a.due_date < b.due_date)
            })}
          </Container>
        )}

        {todayEvents.length > 0 && (
          <Container id="today_events" key="today_events">
            {this.renderItems({
              title: 'Today Events',
              items: todayEvents.sort((a, b) => a.due_date < b.due_date)
            })}
          </Container>
        )}

        {sortedPastEvents.length > 0 &&
          sortedPastEvents.map(monthIndex => {
            const month = pastEventsIndexedInMonths[monthIndex]
            const id = month.title.replace(' ', '_')

            return (
              <Container id={id} key={`past_events_${id}`}>
                {this.renderItems({
                  title: month.title,
                  items: _.sortBy(month.items, item =>
                    item.due_date != null ? !item.due_date : !item.created_at
                  )
                })}
              </Container>
            )
          })}

        {this.state.selectedNote && (
          <EditNoteDrawer
            isOpen
            note={this.state.selectedNote}
            onClose={this.closeEditNoteDrawer}
            onSubmit={this.props.editNoteHandler}
            onDelete={this.props.deleteNoteHandler}
          />
        )}

        {this.renderCRMTaskItemsDrawer()}
      </div>
    )
  }
}

function isToday(date) {
  return setTime(new Date(date)).getTime() === setTime(new Date()).getTime()
}

// todo: bug - sorting of past events when a event is edited.
