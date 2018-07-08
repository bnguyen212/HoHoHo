import React from 'react';
import { StackNavigator } from 'react-navigation';

import Swiper from 'react-native-swiper';
import HomeScreen from './components/HomeScreen';
import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import UsersScreen from './components/UsersScreen';
import MessagesScreen from './components/MessagesScreen';

class SwiperScreen extends React.Component {
  static navigationOptions = {
    title: 'HoHoHo!',
    headerLeft: null
  };

  render() {
    return (
      <Swiper showsPagination={false} loop={false}>
        <UsersScreen />
        <MessagesScreen />
      </Swiper>
    );
  }
}

//Navigator
export default StackNavigator({
  Home: {
    screen: HomeScreen,
  },
  Register: {
    screen: RegisterScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  Swiper: {
    screen: SwiperScreen,
  }
}, {initialRouteName: 'Home'});