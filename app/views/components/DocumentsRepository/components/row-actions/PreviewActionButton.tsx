import { Button, CircularProgress } from '@material-ui/core'

import { useFetchForms } from '../../queries/use-fetch-forms'

interface Props {
  form: IBrandForm
}

export function PreviewActionButton({ form }: Props) {
  const { fetchForms, isFetching } = useFetchForms()

  const handleClick = async () => {
    const result = await fetchForms([form.id])

    if (result) {
      window.open(result[0].url)
    }
  }

  return (
    <Button
      size="small"
      variant="outlined"
      disabled={isFetching}
      onClick={handleClick}
    >
      {isFetching ? (
        <>
          <CircularProgress size={20} />
          &nbsp;Opening
        </>
      ) : (
        <>Preview</>
      )}
    </Button>
  )
}
