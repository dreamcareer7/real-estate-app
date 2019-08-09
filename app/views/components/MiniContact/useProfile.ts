import { useEffect, useState } from 'react'

import { FormatterOutputType } from './types'
import { findContact } from './helpers'
import { formatter } from './MiniContact-formatters'

function useProfile(type, initData): FormatterOutputType {
  let data = formatter(type, initData)
  const [output, setOutput] = useState(data)

  useEffect(function useProfileEffect() {
    let cancelRequest = false

    async function fetchContact(searchFor) {
      const res = await findContact(searchFor, data)

      if (!cancelRequest) {
        setOutput(res)
      }
    }

    // If it has a contact id, we should get the contact from server.
    if (data.contact_id) {
      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Getting contact from server and updating the state.
      fetchContact(data.contact_id)
    } else if (data.data.email) {
      // If it's not a contact, we are trying to find it in contacts.

      // Loading mode.
      setOutput({
        ...data,
        contact_status: 'loading'
      })

      // Trying to find the contact, if it's not exsits, we are returning the `data`
      // if it is, we will return the contact.
      fetchContact(data.data.email)
    }

    return function cleanUpProfile() {
      cancelRequest = true
    }
    // eslint-disable-next-line
  }, [])

  return output
}

export default useProfile
