import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  top: ${props => (props.position && props.position.top) || 0};
  left: ${props => (props.position && props.position.left) || 0};
  z-index: 3;
  max-width: 100vw;
  width: 35rem;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 1.5px 6px rgba(0, 0, 0, 0.12), 0 1.5px 6px rgba(0, 0, 0, 0.24);
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #f2f2f2;
  padding: 0 0.5rem;
`

export const Body = styled.div`
  padding: 0.5rem;
`

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem 0.5rem;
  background-color: #f2f2f2;
`
