import React from 'react'
import PropTypes from 'prop-types'
import Flex from 'styled-flex-component'
import { Box, Button, IconButton, Tooltip } from '@material-ui/core'
import { mdiTrashCanOutline } from '@mdi/js'

import {
  mdiNoteTextOutline,
  mdiAccountPlusOutline,
  mdiClockTimeFourOutline
} from '@mdi/js'

import { getTask, updateTask, createTask, deleteTask } from 'models/tasks'
import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'
import { isSoloActiveTeam } from 'utils/user-teams'
import ConfirmationModalContext from 'components/ConfirmationModal/context'
import { SvgIcon } from 'components/SvgIcons/SvgIcon'

import { Divider } from '../../Divider'
import Drawer from '../../OverlayDrawer'
import { ItemChangelog } from '../../TeamContact/ItemChangelog'

import { Title } from '../../EventDrawer/components/Title'
import { Description } from '../../EventDrawer/components/Description'
import Reminder from '../../EventDrawer/components/Reminder/Reminder'
import { EventField } from '../../EventDrawer/components/EventField'
import {
  FormContainer,
  FieldContainer,
  AssosiationContainer
} from '../../EventDrawer/styled'

import AddAssociation from '../../AddAssociation'
import {
  AssigneesField,
  AssociationsList,
  DateTimeField,
  EndTimeField,
  FieldError
} from '../../final-form-fields'
import LoadSaveReinitializeForm from '../../../utils/LoadSaveReinitializeForm'

import { validate } from './helpers/validate'
import { preSaveFormat } from './helpers/pre-save-format'
import { prePreviewFormat } from './helpers/pre-preview-format'
import { postLoadFormat } from './helpers/post-load-format'

import { Locations } from './components/Locations'
import { PreviewTourSheets } from '../PreviewTourSheets'

import { Footer } from './styled'

const propTypes = {
  ...Drawer.propTypes,
  tour: PropTypes.any,
  tourId: PropTypes.any,
  initialValues: PropTypes.shape(),
  submitCallback: PropTypes.func,
  deleteCallback: PropTypes.func,
  user: PropTypes.shape().isRequired,
  listings: PropTypes.arrayOf(PropTypes.shape())
}

const defaultProps = {
  ...Drawer.defaultProps,
  tour: null,
  tourId: undefined,
  initialValues: {},
  listings: [],
  submitCallback: () => {},
  deleteCallback: () => {}
}

/**
 * Represents a CRM Tour in a drawer view.
 *
 * NOTE: Its title and initial states controlling by props.
 * Because of the drawer component nature, we have to
 * unmount it after each time closing. And also mount it
 * after opening until we can reinitialize it.
 *
 */
export class TourDrawer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isDisabled: false,
      isSaving: false,
      shouldShowDescription: false,
      tour: props.tour
    }

    this.isNew =
      (!props.tour && !props.tourId) ||
      Object(this.props.initialValues).length > 0
  }

  static contextType = ConfirmationModalContext

  load = async () => {
    if (this.props.tour) {
      return this.props.tour
    }

    if (this.props.tourId) {
      try {
        this.setState({ isDisabled: true })

        const tour = await getTask(this.props.tourId, CRM_TASKS_QUERY)

        this.setState({ isDisabled: false, tour })

        return tour
      } catch (error) {
        console.log(error)
        this.setState({ isDisabled: false })
      }
    }

    return null
  }

  save = async tour => {
    try {
      let newTour
      let action = 'created'

      this.setState({ isDisabled: true, isSaving: true })

      if (tour.id) {
        newTour = await updateTask(tour, CRM_TASKS_QUERY)
        action = 'updated'
      } else {
        newTour = await createTask(tour, CRM_TASKS_QUERY)
      }

      this.setState(
        { isDisabled: false, isSaving: false, tour: newTour },
        () => {
          this.props.onClose()
          this.props.submitCallback(newTour, action)
        }
      )
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false, isSaving: false })
    }
  }

  onDelete = () => {
    this.context.setConfirmationModal({
      message: 'Delete Toursheet',
      description: `Are you sure about deleting "${this.state.tour.title}"?`,
      confirmLabel: 'Yes, I am sure',
      onConfirm: () => this.handleDelete()
    })
  }

  handleDelete = async () => {
    try {
      this.setState({ isDisabled: true })
      await deleteTask(this.state.tour.id)
      this.setState({ isDisabled: false }, () => {
        this.props.onClose()
        this.props.deleteCallback(this.state.tour)
      })
    } catch (error) {
      console.log(error)
      this.setState({ isDisabled: false })
    }
  }

  showDescriptionField = () => {
    this.setState(() => ({
      shouldShowDescription: true
    }))
  }

  render() {
    const { user } = this.props
    const { isDisabled, shouldShowDescription } = this.state

    return (
      <Drawer open={this.props.isOpen} onClose={this.props.onClose}>
        <Drawer.Header title={`${this.isNew ? 'New' : 'Edit'} Toursheet`} />
        <Drawer.Body>
          <LoadSaveReinitializeForm
            initialValues={this.props.initialValues}
            load={this.load}
            postLoadFormat={tour =>
              postLoadFormat(tour, user, this.props.listings)
            }
            preSaveFormat={(values, originalValues) =>
              preSaveFormat(values, originalValues, user)
            }
            save={this.save}
            validate={validate}
            render={formProps => {
              const { values, handleSubmit } = formProps

              return (
                <FormContainer id="tour-drawer-form" onSubmit={handleSubmit}>
                  <EventField
                    title="title"
                    iconProps={{
                      path: mdiNoteTextOutline
                    }}
                  >
                    <Title fullWidth placeholder="Untitled tour" />
                    <Box mt={1}>
                      {shouldShowDescription || values?.description ? (
                        <Description placeholder="Enter any general notes for your clients" />
                      ) : (
                        <Button
                          color="secondary"
                          onClick={this.showDescriptionField}
                        >
                          Add Description
                        </Button>
                      )}
                    </Box>
                  </EventField>
                  <EventField
                    title="date"
                    iconProps={{
                      path: mdiClockTimeFourOutline
                    }}
                  >
                    <FieldContainer
                      alignCenter
                      justifyBetween
                      style={{ marginBottom: '0.5em' }}
                    >
                      <DateTimeField
                        name="dueDate"
                        selectedDate={values.dueDate}
                        datePickerModifiers={{
                          disabled: {
                            before: new Date()
                          }
                        }}
                      />

                      <EndTimeField dueDate={values.dueDate} />
                    </FieldContainer>

                    <FieldError
                      name="endDate"
                      style={{ fontSize: '1rem', marginBottom: '0.5em' }}
                    />
                  </EventField>
                  <Reminder dueDate={values.dueDate} />

                  <Box ml={4} mb={2}>
                    <Locations
                      locations={values.locations}
                      handleDelete={this.handleDeleteAssociation}
                    />
                    <Box mt={0.5}>
                      <AddAssociation
                        showTitle
                        isPrimary
                        disabled={isDisabled}
                        type="listing"
                        name="locations"
                        isMultipleSelected
                      />
                    </Box>
                  </Box>
                  <EventField
                    title="contact-associations"
                    iconProps={{
                      path: mdiAccountPlusOutline
                    }}
                  >
                    <AssosiationContainer>
                      <AssociationsList
                        filterType="contact"
                        name="clients"
                        associations={values.clients}
                      />
                      <AddAssociation
                        showTitle
                        disabled={isDisabled}
                        type="contact"
                        name="clients"
                      />
                    </AssosiationContainer>
                  </EventField>
                  <ItemChangelog item={values} style={{ marginTop: '2em' }} />
                  <Footer justifyBetween>
                    <Flex alignCenter>
                      {!this.isNew && (
                        <>
                          <Tooltip placement="top" title="Delete">
                            <IconButton
                              size="small"
                              disabled={isDisabled}
                              onClick={this.onDelete}
                            >
                              <SvgIcon path={mdiTrashCanOutline} />
                            </IconButton>
                          </Tooltip>
                          <Divider
                            margin="0 0.5rem"
                            width="1px"
                            height="1rem"
                          />
                        </>
                      )}
                      {!isSoloActiveTeam(user) && (
                        <AssigneesField
                          buttonText="Assignee"
                          name="assignees"
                          owner={user}
                        />
                      )}
                    </Flex>
                    <Flex alignCenter>
                      <Tooltip title="Preview and print tour sheets">
                        <PreviewTourSheets
                          agent={user}
                          disabled={isDisabled}
                          listings={values.locations.map(
                            l => l.listing.original
                          )}
                          tour={prePreviewFormat(values, this.state.tour)}
                        />
                      </Tooltip>
                      <Button
                        variant="contained"
                        type="submit"
                        color="secondary"
                        disableElevation
                        disabled={isDisabled}
                        style={{ marginLeft: '0.5em' }}
                      >
                        {this.state.isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </Flex>
                  </Footer>
                </FormContainer>
              )
            }}
          />
        </Drawer.Body>
      </Drawer>
    )
  }
}

TourDrawer.propTypes = propTypes
TourDrawer.defaultProps = defaultProps
