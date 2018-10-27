import styled from 'styled-components'

import { primary } from 'views/utils/colors'

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.8rem;
`

export const StatusContainer = styled.div``

export const Actions = styled.div``

export const Input = styled.input`
  height: 2.3rem;
  border: 1px solid ${primary};
  border-radius: 3px;
  padding: 0 0.5rem;
  width: 80%;
`

export const TitleContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-top: 0.625rem;

  .sk-circle {
    margin: 0 !important;
    width: 2rem !important;
    height: 2rem !important;
  }
`

export const Title = styled.p`
  /* width: 80%; */
  font-size: 1.25rem;
  font-weight: 900;
`
