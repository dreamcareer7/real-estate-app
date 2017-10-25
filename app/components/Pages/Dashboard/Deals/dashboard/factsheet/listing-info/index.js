import React from 'react'
import Deal from '../../../../../../../models/Deal'
import Items from '../items'

const table = [
  {
    key: 'list_price',
    name: 'List Price',
    dataType: 'currency',
    canEdit: (isBO) => isBO
  }, {
    key: 'property_type',
    name: 'Property Type',
    dataType: 'text',
    disabled: true,
    canEdit: (isBO) => isBO
  }, {
    key: 'file_id',
    name: 'File ID',
    dataType: 'text',
    canEdit: (isBO) => isBO
  }
]

const getValue = (deal, field) => {
  const value = Deal.get.field(deal, field.key)

  const object = {
    value,
    rawValue: value
  }

  if (field.dataType === 'currency') {
    object.value = Deal.get.formattedPrice(value)
  }

  return object
}

export default ({ deal }) => (
  <div className="deal-info-section">
    <Items
      deal={deal}
      title="Listing Information"
      table={table}
      getValue={getValue}
    />
  </div>
)

// function print(deal, field, info) {
//   const type = info[1]
//   const value = Deal.get.field(deal, field)

//   if (type === 'price') {
//     return Deal.get.formattedPrice(value)
//   }

//   return value
// }

// export default ({
//   deal
// }) => (
//   <div className="deal-info-section">
//     <div className="deal-info-title">
//       Listing Information
//     </div>

//     <table className="fact-table listing-info">
//       <tbody>
//         {
//           _.map(table, (info, field) => (
//             <tr key={`LISTING_INFO_FIELD_${field}`}>
//               <td className="name no-status">{info[0]}</td>
//               <td className="field">
//                 {print(deal, field, info)}
//               </td>
//             </tr>
//           ))
//         }
//       </tbody>
//     </table>
//   </div>
// )

