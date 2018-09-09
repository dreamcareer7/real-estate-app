import React from 'react'
import PdfViewer from '../../../../Partials/Pdf/Viewer'

function getExtensionName(file) {
  return file.name.split('.').pop()
}

export default ({
  width,
  file,
  onPdfZoomIn,
  onPdfZoomOut,
  disableKeyboardShortcuts = false
}) => {
  const { name, type, url, downloadUrl } = file

  return (
    <div style={{ width }} className="c-deal-form-viewer__viewer">
      {file &&
        type === 'pdf' && (
          <PdfViewer
            uri={url}
            downloadUrl={downloadUrl}
            defaultContainerHeight="85vh"
            onZoomIn={onPdfZoomIn}
            onZoomOut={onPdfZoomOut}
            disableKeyboardShortcuts={disableKeyboardShortcuts}
          />
        )}

      {file &&
        type === 'image' && <img className="image" src={url} alt={name} />}

      {file &&
        type === 'html' && (
          <iframe
            frameBorder="0"
            src={url}
            width="90%"
            height="90%"
            title="deal-viewer"
          />
        )}

      {file &&
        type === 'unknown' && (
          <div className="no-preview">
            Can not preview <strong>.{getExtensionName(file)}</strong> files
            <p className="file-name">{file.name}</p>
            <div>
              <a href={file.url}>Download</a>
            </div>
          </div>
        )}
    </div>
  )
}
