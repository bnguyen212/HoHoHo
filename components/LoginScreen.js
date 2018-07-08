import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TextInput,
  AsyncStorage
} from 'react-native';

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

  static navigationOptions = {
    title: 'Login'
  };

  login() {
    if (this.state.username && this.state.password) {
      fetch('https://hohoho-backend.herokuapp.com/login', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success === true) {
          AsyncStorage.setItem('user', JSON.stringify({
            username: this.state.username,
            password: this.state.password
          }));
          this.props.navigation.navigate('Swiper');
         } else {
          this.setState({message: responseJson.error})
        }
      })
      .catch(err => console.log('ERROR:', err));
    } else {
      this.setState({message: 'Username or Password is missing.'})
    }

  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(result => {
      var parsedResult = JSON.parse(result);
      var username = parsedResult.username;
      var password = parsedResult.password;
      if (username && password) {
        this.setState({username: username, password: password});
      }
    })
    .catch(err => console.log('ERROR:', err))
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.warning}>{this.state.message}</Text>
        <TextInput
          style={[styles.form, styles.button]}
          placeholder="Enter your username"
          value={this.state.username}
          onChangeText={username=> this.setState({username})} />
        <TextInput
          style={[styles.form, styles.button]}
          placeholder="Enter your password"
          secureTextEntry={true}
          value={this.state.password}
          onChangeText={password => this.setState({password})} />
        <TouchableOpacity 
          style={[styles.button, styles.buttonBlue]}
          onPress={this.login.bind(this)}>
          <Text style={styles.buttonLabel}>Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  form: {
    height: 50,
    paddingLeft: 20,
    borderColor: 'black',
    borderWidth: 2
  },
  warning: {
    color: 'red',
    fontSize: 15
  },
  button: {
    alignSelf: 'stretch',
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 5
  },
  buttonBlue: {
    backgroundColor: '#0074D9'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});