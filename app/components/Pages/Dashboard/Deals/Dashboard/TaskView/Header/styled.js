import styled from 'styled-components'

import { primary } from 'views/utils/colors'
import { merriweatherFamilyStyle } from 'components/Typography/styles'

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 1.8rem;
`

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
  margin-top: 1rem;

  .sk-circle {
    margin: 0 !important;
    width: 2rem !important;
    height: 2rem !important;
  }
`

export const Title = styled.div`
  ${merriweatherFamilyStyle};
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 500;
  padding: 0.825rem 2px;
  border: 1px dashed #fff;

  :hover {
    cursor: pointer;
    border: 1px dashed ${primary};
  }
`