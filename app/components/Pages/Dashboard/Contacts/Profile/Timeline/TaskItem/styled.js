import styled, { css } from 'styled-components'

import {
  borderColor,
  grey,
  primary
} from '../../../../../../../views/utils/colors'

export const Container = styled.div`
  position: relative;
  padding: 1.5em;
  border-bottom: 1px solid ${borderColor};

  &:hover {
    background-color: ${grey.A000};
  }

  .u-cursor--pointer:hover {
    cursor: pointer;
  }
`

export const Title = styled.h3`
  margin: 0 0 1rem;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1;
  word-break: break-all;

  ${props =>
    props.truncate &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};

  &:hover {
    color: ${primary};
    text-decoration: underline;
  }
`

export const Description = styled.p`
  color: ${grey.A900};
  margin: 0;
`
