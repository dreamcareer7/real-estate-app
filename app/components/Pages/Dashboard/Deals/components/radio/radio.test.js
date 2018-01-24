import React from 'react'
import renderer from 'react-test-renderer'
import { shallow, mount, render } from 'enzyme'
import ReactTestUtils from 'react-dom/test-utils'
import Radio from '.'

test('Should render radio button with title', () => {
  const title = 'Sample Checkbox'
  const Wrapper = <Radio square title={title} disabled={false} selected={false} />

  const wrapper = shallow(Wrapper)

  expect(wrapper.find('.radio-label').text()).toEqual(title)
})

test('Should select and unselect radio button on clicking', () => {
  const Wrapper = <Radio square title="Sample" disabled={false} selected={false} />

  const wrapper = shallow(Wrapper)

  expect(wrapper.find('.selected').length).toBe(0)

  // change "selected" prop
  wrapper.setProps({ selected: true })

  expect(wrapper.find('.selected').length).toBe(1)
})

test('Should render checkbox when square prop is passed', () => {
  const Wrapper = <Radio square title="Sample" disabled={false} selected={false} />

  const wrapper = shallow(Wrapper)

  expect(wrapper.find('.square').length).toBe(1)
})
