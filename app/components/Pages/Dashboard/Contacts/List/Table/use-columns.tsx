import { makeStyles, Theme } from '@material-ui/core'
import {
  mdiCake,
  mdiCalendar,
  mdiEmail,
  mdiFlash,
  mdiPhone,
  mdiTag
} from '@mdi/js'

import { useBreakpoint } from '@app/hooks/use-breakpoint'
import { getAttributeFromSummary } from '@app/models/contacts/helpers'
import ALink from '@app/views/components/ALink'
import { HeaderColumn } from '@app/views/components/Grid/Table/features/HeaderColumn'
import { SelectionCount } from '@app/views/components/Grid/Table/features/Selection/SelectionCount'
import { TableColumn } from '@app/views/components/Grid/Table/types'

import { TagsInlineEdit } from './columns-inline-edit/Tags'
import LastTouched from './columns/LastTouched'

const useStyles = makeStyles(
  (theme: Theme) => ({
    cell: {
      paddingLeft: theme.spacing(2),
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }),
  {
    name: 'Contacts-Table-Columns'
  }
)

interface Data {
  totalRows: number
}

export function useColumns({ totalRows }: Data): TableColumn<IContact>[] {
  const classes = useStyles()
  const breakpoint = useBreakpoint()

  return [
    {
      id: 'name',
      header: () => <SelectionCount totalRows={totalRows} />,
      render: ({ row: contact }) => (
        <ALink to={`/dashboard/contacts/${contact.id}`}>
          {getAttributeFromSummary(contact, 'display_name')}
        </ALink>
      )
    },
    {
      id: 'tags',
      hidden: ['xs', 'sm'].includes(breakpoint),
      header: () => <HeaderColumn text="Tags" iconPath={mdiTag} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          {contact.tags?.slice(0, 2).join(', ')}
        </div>
      ),
      renderInlineEdit: ({ row: contact }) => (
        <TagsInlineEdit contact={contact} />
      )
    },
    {
      id: 'phone',
      header: () => <HeaderColumn text="Phone" iconPath={mdiPhone} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>{contact.phone_number}</div>
      ),
      renderInlineEdit: ({ row: contact }) => <div>11</div>
    },
    {
      id: 'email',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Email" iconPath={mdiEmail} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>{contact.email}</div>
      ),
      renderInlineEdit: ({ row: contact }) => <div>22</div>
    },
    {
      id: 'last-touch',
      hidden: ['xs'].includes(breakpoint),
      header: () => <HeaderColumn text="Last Touch" iconPath={mdiCalendar} />,
      render: ({ row: contact }) => (
        <div className={classes.cell}>
          <LastTouched contact={contact} title="" />
        </div>
      )
    },
    {
      id: 'flows',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Flows" iconPath={mdiFlash} />,
      render: ({ row: contact }) => <div>-</div>
    },
    {
      id: 'birthday',
      hidden: breakpoint !== 'xl',
      header: () => <HeaderColumn text="Birthday" iconPath={mdiCake} />,
      render: ({ row: contact }) => <div>-</div>
    }
  ]
}
