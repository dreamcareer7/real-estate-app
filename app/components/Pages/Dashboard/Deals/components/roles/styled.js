import styled from 'styled-components'
import { SectionTitle } from '../../Dashboard/Factsheet/styled'

export const RolesContainer = styled.div`
  padding: 1.5rem; /* 24px */
`

export const RolesTitle = styled(SectionTitle)`
  padding: 0;
  margin-bottom: 1.5rem;
`

export const RoleActions = styled.div`
  width: 5%;
  opacity: 0;
  text-align: right;
`

export const RoleItem = styled.div`
  display: flex;
  align-items: center;
  border-radius: 3px;
  margin-bottom: 1rem;
  cursor: pointer;

  :hover ${RoleActions} {
    opacity: 1;
  }
`

export const RoleAvatar = styled.div`
  text-align: center;
`

export const RoleInfo = styled.div`
  text-align: left;
  padding-left: 0.625rem;
`

export const RoleTitle = styled.div`
  color: #263445;
  font-size: 1rem;
`

export const RoleType = styled.div`
  font-weight: normal;
  color: #8696a4;
  font-size: 1rem;
  text-decoration: none;
`
