import { useState, ReactNode } from 'react'
import { Box } from '@material-ui/core'

import { Table } from 'components/Grid/Table'
import { TableColumn } from 'components/Grid/Table/types'

import ShowingRoleListColumnPerson from './ShowingRoleListColumnPerson'
import ShowingRoleListColumnActions from './ShowingRoleListColumnActions'
import ShowingRoleListColumnMediums from './ShowingRoleListColumnMediums'
import ShowingRoleFormDialog from './ShowingRoleFormDialog'
import ShowingRoleListAddNewButton from './ShowingRoleListAddNewButton'
import { ShowingRoleFormValues } from './types'
import { getShowingRoleLabel } from './helpers'

interface ShowingRoleListProps {
  value: IShowingRole[]
  onChange: (value: IShowingRole[]) => void
  children?: ReactNode
}

function ShowingRoleList({
  value: roles,
  onChange,
  children
}: ShowingRoleListProps) {
  const [addRole, setAddRole] = useState<Nullable<IShowingRoleType>>(null)

  const openAddDialog = (role: IShowingRoleType) => setAddRole(role)

  const closeAddDialog = () => setAddRole(null)

  const handleAdd = (role: ShowingRoleFormValues) => {
    // TODO: add the role at the end of the roles list
    console.log('handleAdd::role', role)
    onChange(roles)
  }

  const handleEdit = (updatedRole: IShowingRole) => {
    const roleIndex = roles.findIndex(role => role.id === updatedRole.id)

    if (roleIndex === -1) {
      return
    }

    const newRoles = [...roles]

    newRoles.splice(roleIndex, 1, updatedRole)

    onChange(newRoles)
  }

  const columns: TableColumn<IShowingRole>[] = [
    {
      id: 'contact',
      width: '25%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnPerson
          name={`${row.first_name} ${row.last_name}`.trim()}
          role={row.role}
        />
      )
    },
    {
      id: 'confirm_notification_type',
      width: '30%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Confirm via"
          types={row.confirm_notification_type}
        />
      )
    },
    {
      id: 'cancel_notification_type',
      width: '30%',
      sortable: false,
      render: ({ row }) => (
        <ShowingRoleListColumnMediums
          label="Get Notify On"
          types={row.cancel_notification_type}
        />
      )
    },
    {
      id: 'body-actions',
      sortable: false,
      align: 'right',
      render: ({ row }) => (
        <ShowingRoleListColumnActions role={row} onEdit={handleEdit} />
      )
    }
  ]

  return (
    <div>
      <Table
        rows={roles}
        totalRows={roles.length}
        columns={columns}
        virtualize={false}
      />
      <Box display="flex" justifyContent="space-between" mt={2}>
        <ShowingRoleListAddNewButton onClick={openAddDialog} />
        {children}
      </Box>
      <ShowingRoleFormDialog
        title={`Add ${getShowingRoleLabel(addRole!)} Role`}
        open={!!addRole}
        onClose={closeAddDialog}
        onConfirm={handleAdd}
        initialValues={{ role: addRole ?? undefined }}
      />
    </div>
  )
}

export default ShowingRoleList
