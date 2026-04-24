import Reactotron from 'reactotron-react-native'

if (__DEV__) {
  Reactotron.configure({ host: 'localhost' }).useReactNative().connect()
}

export default Reactotron
