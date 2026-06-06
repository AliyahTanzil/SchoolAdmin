jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'))

// Mock react-navigation native for tests to avoid native module/asset loading
jest.mock('@react-navigation/native', () => {
  return {
    NavigationContainer: ({ children }) => require('react').createElement(require('react').Fragment, null, children),
    useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
  }
})

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => {
    const React = require('react')
    const Navigator = ({ children }) => React.createElement(React.Fragment, null, children)
    const Screen = () => null
    return { Navigator, Screen }
  }
}))
