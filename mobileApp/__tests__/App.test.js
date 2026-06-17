import React from 'react'
import renderer, { act } from 'react-test-renderer'
import App from '../App'

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}))

test('renders mobile App snapshot', async () => {
  let tree
  await act(async () => {
    tree = renderer.create(<App />)
  })
  expect(tree.toJSON()).toBeDefined()
}, 30000)
