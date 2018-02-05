import React, { Fragment } from 'react'
import ReactTable from 'react-table'
import { connect } from 'react-redux'
import { Dropdown, Button } from 'react-bootstrap'
import moment from 'moment'
import _ from 'underscore'
import { getDeal, setUploadFiles } from '../../../../../store_actions/deals'
import Radio from '../components/radio'
import VerticalDotsIcon from '../../Partials/Svgs/VerticalDots'
import Search from '../../../../Partials/headerSearch'

export class FileManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: '',
      deleting: null,
      selectedRows: []
    }
  }

  getDate(date) {
    return moment.unix(date).format('MMMM DD, YY [at] hh:mm A')
  }

  applyFilter(file, task) {
    const { filter } = this.state

    if (filter.length === 0) {
      return true
    }

    return file.name.includes(filter) || task.title.includes(filter)
  }

  getAllFiles() {
    const { deal, checklists, tasks } = this.props
    const files = []

    deal.checklists.forEach(chId => {
      const checklist = checklists[chId] || []

      checklist.tasks.forEach(tId => {
        const task = tasks[tId]
        const attachments = task.room.attachments || []

        attachments.filter(file => this.applyFilter(file, task)).forEach(file => {
          files.push({
            id: file.id,
            name: file.name,
            task: task.title,
            created_at: file.created_at
          })
        })
      })
    })

    return files
  }

  getCellTitle(title) {
    return (
      <Fragment>
        {title}
        <i className="fa fa-caret-down" />
        <i className="fa fa-caret-up" />
      </Fragment>
    )
  }

  toggleSelectedRow(id) {
    const { selectedRows } = this.state
    let newSelectedRows = []

    if (selectedRows.indexOf(id) > -1) {
      newSelectedRows = selectedRows.filter(rowId => rowId !== id)
    } else {
      newSelectedRows = [...selectedRows, id]
    }

    this.setState({ selectedRows: newSelectedRows })
  }

  render() {
    const { selectedRows, deleting } = this.state
    const data = this.getAllFiles()

    const columns = [
      {
        Header: '',
        accessor: '',
        width: 40,
        Cell: props => (
          <Radio
            selected={selectedRows.indexOf(props.original.id) > -1}
            onClick={() => this.toggleSelectedRow(props.original.id)}
          />
        )
      },
      {
        Header: () => this.getCellTitle('NAME'),
        accessor: 'name'
      },
      {
        id: 'created_at',
        Header: () => this.getCellTitle('DATE UPLOADED'),
        accessor: 'created_at',
        Cell: props => this.getDate(props.value)
      },
      {
        Header: () => this.getCellTitle('TASK'),
        accessor: 'task'
      },
      {
        Header: '',
        accessor: '',
        className: 'td--dropdown-container',
        width: 30,
        Cell: props => (
          <Dropdown
            id={`file_${props.original.id}`}
            className="deal-file-cta-menu"
            pullRight
          >
            <Button
              onClick={e => e.stopPropagation()}
              className="cta-btn btn-link"
              bsRole="toggle"
            >
              <VerticalDotsIcon fill="#D7DEE2" />
            </Button>

            <Dropdown.Menu>
              <li>
                {deleting ? (
                  <span>
                    <i className="fa fa-spinner fa-spin" /> Deleting ...
                  </span>
                ) : (
                  <span>Delete file</span>
                )}
              </li>
            </Dropdown.Menu>
          </Dropdown>
        )
      }
    ]

    return (
      <div className="table-container">
        <Search
          onInputChange={filter => this.setState({ filter })}
          debounceTime={100}
          placeholder="Search all uploaded files in this deal…"
        />

        <ReactTable
          showPagination={false}
          data={data}
          pageSize={data.length}
          columns={columns}
          sortable
          multiSort
          resizable
          filterable={false}
        />
      </div>
    )
  }
}

export default connect(
  ({ deals }) => ({
    checklists: deals.checklists,
    tasks: deals.tasks
  }),
  {
    getDeal,
    setUploadFiles
  }
)(FileManager)
