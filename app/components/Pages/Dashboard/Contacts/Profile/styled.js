import styled from 'styled-components'

export const ColumnsContainer = styled.div`
  padding: 1em;

  @media (min-width: 64em) {
    display: flex;
  }
`

export const SideColumnWrapper = styled.div`
  overflow: hidden;

  @media (min-width: 64em) {
    width: 30%;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 100em) {
    width: 25%;
    display: block;
  }
`

export const SecondColumn = styled.div`
  @media (min-width: 64em) {
    width: calc(70% - 1em);
    margin-left: 1em;
  }

  @media (min-width: 100em) {
    margin: 0 1em;
    width: calc(50% - 2em);
  }
`

export const ThirdColumn = styled.div`
  @media (min-width: 100em) {
    width: 25%;
  }
`
