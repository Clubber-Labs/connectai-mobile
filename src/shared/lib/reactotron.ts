import { Platform } from 'react-native'
import Reactotron from 'reactotron-react-native'

if (__DEV__) {
  const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost'
  Reactotron.configure({ host }).useReactNative().connect()
}

export default Reactotron
