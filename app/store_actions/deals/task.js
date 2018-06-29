import { normalize } from 'normalizr'
import types from '../../constants/deals'
import Deal from '../../models/Deal'
import * as schema from './schema'

function addNewTask(deal_id, list_id, task) {
  return {
    type: types.CREATE_TASK,
    deal_id,
    list_id,
    task
  }
}

function changeStatus(taskId, status) {
  return {
    type: types.CHANGE_TASK_STATUS,
    taskId,
    status
  }
}

function needsAttention(taskId, status) {
  return {
    type: types.CHANGE_ATTENTION_REQUESTED,
    taskId,
    status
  }
}

function taskDeleted(checklistId, taskId) {
  return {
    type: types.DELETE_TASK,
    checklistId,
    taskId
  }
}

function taskUpdated(task) {
  return {
    type: types.UPDATE_TASK,
    task
  }
}

export function updatesTasks(tasks) {
  return {
    type: types.UPDATE_TASKS,
    tasks
  }
}

export function setTasks(tasks) {
  return {
    type: types.GET_TASKS,
    tasks
  }
}

export function setSelectedTask(task) {
  return {
    type: types.SET_SELECTED_TASK,
    task
  }
}

export function deleteTask(checklistId, taskId) {
  return async dispatch => {
    Deal.deleteTask(taskId)
    dispatch(taskDeleted(checklistId, taskId))
  }
}

export function updateTask(taskId, attributes) {
  return async dispatch => {
    const task = await Deal.updateTask(taskId, attributes)

    dispatch(taskUpdated(task))
  }
}

export function createFormTask(dealId, form, title, checklist) {
  const task_type = 'Form'
  const status = 'Incomplete'

  return async dispatch => {
    const task = await Deal.createTask(dealId, {
      title,
      status,
      task_type,
      checklist,
      form
    })

    dispatch(addNewTask(dealId, checklist, task))

    return task
  }
}

export function createGenericTask(dealId, title, checklist) {
  const status = 'Incomplete'
  const task_type = 'Generic'

  return async dispatch => {
    const task = await Deal.createTask(dealId, {
      title,
      status,
      task_type,
      checklist
    })

    dispatch(addNewTask(dealId, checklist, task))

    return task
  }
}

export function changeTaskStatus(deal_id, status) {
  return async dispatch => {
    await Deal.changeTaskStatus(deal_id, status)
    dispatch(changeStatus(deal_id, status))
  }
}

export function changeNeedsAttention(deal_id, task_id, status) {
  return async dispatch => {
    await Deal.needsAttention(deal_id, task_id, status)
    dispatch(needsAttention(task_id, status))
  }
}
