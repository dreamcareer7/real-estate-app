import React from 'react'
import { connect } from 'react-redux'

import Downshift from 'downshift'
import { addNotification as notify } from 'reapop'

import {
  createFormTask,
  changeNeedsAttention
} from '../../../../../../store_actions/deals'

import { Tasks } from './checklist-tasks'
import { Forms } from './checklist-forms'
import { CreateTaskItem } from './create-task/new-item'
import { CreateTaskForm } from './create-task/form'
import { ChecklistStash } from './checklist-stash'
import { ChecklistTitle } from './styled'

import { SearchInput } from './search-input'
import { DropDownContainer, DropDownMenu } from './styled'

class DropDownTasks extends React.Component {
  state = {
    isMenuOpen: false,
    isCreatingNewTask: false,
    filterValue: null,
    showCreateTaskForm: false,
    selectedNotifyOffice: null
  }

  /**
   * @param {Object} e - the event
   */
  stopPropagation = e => e.stopPropagation()

  notifyOffice = (deal, task) => {
    const { changeNeedsAttention, notify } = this.props

    changeNeedsAttention(deal.id, task.id, true).then(() =>
      notify({
        message: `Office has been notified for "${task.title}"`,
        status: 'success'
      })
    )
  }

  /**
   * @param {UUID} id - the selected task id
   */
  onSelectTask = id => {
    const { tasks, onSelectTask } = this.props
    const { selectedNotifyOffice } = this.state
    const task = id && tasks[id]
    const notifyOffice = task && selectedNotifyOffice === id

    onSelectTask(id, notifyOffice)

    // close menu
    this.toggleMenuState()

    this.setState({
      filterValue: task ? task.title : null,
      selectedNotifyOffice: null
    })
  }

  onRequestNewTask = id => this.setState({ showCreateTaskForm: id })
  onCancelNewTask = () => this.setState({ showCreateTaskForm: null })

  getSearchValue = () => {
    const { filterValue } = this.state
    const { selectedTask, showStashOption } = this.props

    if (filterValue !== null) {
      return filterValue
    } else if (selectedTask) {
      return selectedTask.title.trim()
    } else if (selectedTask === null && showStashOption) {
      return 'Upload directly to my Files'
    }

    return ''
  }

  /**
   * @param {UUID} value - the filter's value
   */
  onInputValueChange = value =>
    this.setState({
      filterValue: value.trim()
    })

  /**
   *
   */
  onChangeNotifyOffice = taskId =>
    this.setState({
      selectedNotifyOffice:
        this.state.selectedNotifyOffice === taskId ? null : taskId
    })

  toggleMenuState = () =>
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
      filterValue: null
    })

  createNewTask = async (checklistId, title, notifyOffice) => {
    const { deal, notify, createFormTask, onSelectTask } = this.props

    this.setState({
      isCreatingNewTask: true
    })

    // create task
    try {
      const task = await createFormTask(deal.id, null, title, checklistId)

      if (notifyOffice) {
        this.notifyOffice(deal, task)
      }

      onSelectTask(task.id)

      this.setState({
        showCreateTaskForm: false,
        isCreatingNewTask: false
      })

      notify({
        message: `Task "${title}" created.`,
        status: 'success'
      })
    } catch (e) {
      this.setState({
        isCreatingNewTask: false
      })

      notify({
        message: 'Could not create the task. try again.',
        status: 'error'
      })
    }
  }

  onSearchInputChange = () => {
    if (this.state.isMenuOpen) {
      return true
    }

    this.setState({
      isMenuOpen: true
    })
  }

  onSelectChecklistForm = async (form, checklistId) => {
    const { deal, onSelectTask, createFormTask } = this.props
    const { selectedNotifyOffice } = this.state

    this.toggleMenuState()

    this.setState({
      filterValue: form.name.trim()
    })

    try {
      const task = await createFormTask(
        deal.id,
        form.id,
        form.name,
        checklistId
      )

      if (selectedNotifyOffice === form.id) {
        this.notifyOffice(deal, task)
      }

      this.setState({
        filterValue: null
      })

      notify({
        message: `Form Task "${form.name}" created.`,
        status: 'success'
      })

      onSelectTask(task.id)
    } catch (e) {
      this.setState({
        isCreatingNewTask: false
      })

      notify({
        message: 'Could not create the task. try again.',
        status: 'error'
      })
    }
  }

  render() {
    const {
      isMenuOpen,
      isCreatingNewTask,
      showCreateTaskForm,
      filterValue,
      selectedNotifyOffice
    } = this.state
    const {
      deal,
      checklists,
      tasks,
      searchable,
      selectedTask,
      placeholder = 'Folder',
      showNotifyOption,
      showStashOption,
      stashOptionText
    } = this.props

    return (
      <Downshift
        isOpen={isMenuOpen}
        onOuterClick={this.toggleMenuState}
        defaultInputValue={filterValue}
        onInputValueChange={this.onInputValueChange}
      >
        {({ getInputProps, isOpen }) => (
          <div style={{ width: '100%' }}>
            <DropDownContainer>
              <SearchInput
                getInputProps={getInputProps}
                isSaving={isCreatingNewTask}
                isMenuOpen={isMenuOpen}
                searchable={searchable}
                selectedTask={selectedTask}
                placeholder={placeholder}
                value={this.getSearchValue()}
                onChange={this.onSearchInputChange}
                onClick={e => {
                  this.stopPropagation(e)
                  this.toggleMenuState()
                }}
                onFocus={this.stopPropagation}
              />

              {isOpen && (
                <DropDownMenu>
                  {showStashOption && (
                    <ChecklistStash
                      onSelect={e => {
                        this.stopPropagation(e)
                        this.onSelectTask(null)
                      }}
                      stashOptionText={stashOptionText}
                      selectedTask={selectedTask}
                    />
                  )}

                  {deal.checklists &&
                    deal.checklists
                      .filter(chId => !checklists[chId].is_terminated)
                      .map(chId => (
                        <div key={chId}>
                          <ChecklistTitle
                            className="checklist"
                            onClick={e => e.stopPropagation()}
                          >
                            {checklists[chId].title}
                          </ChecklistTitle>

                          <Tasks
                            filterValue={filterValue}
                            checklist={checklists[chId]}
                            tasks={tasks}
                            onSelectItem={this.onSelectTask}
                            selectedTask={selectedTask}
                            showNotifyOption={showNotifyOption}
                            onChangeNotifyOffice={this.onChangeNotifyOffice}
                            selectedNotifyOffice={selectedNotifyOffice}
                          />

                          <Forms
                            filterValue={filterValue}
                            checklist={checklists[chId]}
                            tasks={tasks}
                            onSelectItem={this.onSelectChecklistForm}
                            showNotifyOption={showNotifyOption}
                            onChangeNotifyOffice={this.onChangeNotifyOffice}
                            selectedNotifyOffice={selectedNotifyOffice}
                          />

                          {showCreateTaskForm === chId ? (
                            <CreateTaskForm
                              isSaving={isCreatingNewTask}
                              checklist={checklists[chId]}
                              onCancel={this.onCancelNewTask}
                              onFinish={this.createNewTask}
                            />
                          ) : (
                            <CreateTaskItem
                              checklist={checklists[chId]}
                              onSelect={this.onRequestNewTask}
                            />
                          )}
                        </div>
                      ))}
                </DropDownMenu>
              )}
            </DropDownContainer>
          </div>
        )}
      </Downshift>
    )
  }
}

function mapStateToProps({ deals }) {
  return {
    checklists: deals.checklists,
    tasks: deals.tasks
  }
}

export default connect(mapStateToProps, {
  notify,
  createFormTask,
  changeNeedsAttention
})(DropDownTasks)