import React from 'react'
import renderer from 'react-test-renderer'
import App from '../App'

test('renders mobile App snapshot', () => {
  const tree = renderer.create(<App />).toJSON()
  expect(tree).toBeDefined()
})
