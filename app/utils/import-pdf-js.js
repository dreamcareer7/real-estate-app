import pdfjs from 'pdfjs-dist'

export default async function importPdfJs() {
  /* eslint-disable max-len */
  // const pdfjs = await import('pdfjs-dist' /* webpackChunkName: "pdfviewjs" */)
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://pdfjs-dist.surge.sh/pdf.worker.min.js'

  return pdfjs
}
