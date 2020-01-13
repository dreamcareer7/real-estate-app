import React, { useReducer, useEffect } from 'react'
import { Box } from '@material-ui/core'

// @ts-ignore
import Uploader from './components/MediaUploader'

import Header from './components/Header'
import MediaItem from './components/MediaItem'
import UploadPlaceholderItem from './components/UploadPlaceholderItem'
import BulkActionsMenu from './components/BulkActionsMenu'

import { useStyles } from './styles'
import { MediaManagerAPI } from './context'
import { reducer, initialState } from './context/reducers'
import sampleData from './data-sample'
import { addMedia, setGalleryItems } from './context/actions'

interface Props {}

export default function MediaManager(props: Props) {
  const classes = useStyles()

  const [state, dispatch] = useReducer(reducer, initialState)
  const onDrop = (files: [], rejectedFiles: []) => {
    // TODO: Do something with rejected files. Show some alert maybe?
    files.map(file => dispatch(addMedia(file)))
  }

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setGalleryItems(sampleData))
    }

    fetchData()
  }, [])

  return (
    <Uploader onDrop={onDrop} disableClick>
          <MediaManagerAPI.Provider value={{ state, dispatch }}>
        <Box
          className={classes.container}
          border={1}
          bgcolor="#fff"
          borderRadius="4px"
          borderColor="#d4d4d4"
          width={1}
        >
              <Header mediaGallery={state} />
          <Box display="flex" flexWrap="wrap" className={classes.gallery}>
            <UploadPlaceholderItem />
                {state.map(media => (
              <MediaItem key={media.file} {...media} />
            ))}
          </Box>
              {state.filter(media => media.selected).length ? (
                <BulkActionsMenu mediaGallery={state} />
          ) : null}
        </Box>
      </MediaManagerAPI.Provider>
    </Uploader>
  )
}
