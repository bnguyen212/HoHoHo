import React from 'react';
import {
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';

export default class RegisterScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      message: ''
    }
  }

  static navigationOptions = {
    title: 'Register'
  };

  register() {
    if (this.state.username.length >= 6 && this.state.password.length >= 6) {
      fetch('https://hohoho-backend.herokuapp.com/register', {
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
          alert('Successfully registered!');
          this.props.navigation.navigate('Login');
        } else {
          this.setState({message: responseJson.error})
        }
      })
      .catch(err => console.log('ERROR:', err));
    } else {
      this.setState({message: 'Username and Password must be at least 6 characters.'})
    }
  
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Text style={styles.warning}>{this.state.message}</Text>
        <TextInput
          style={[styles.form, styles.button]}
          placeholder="Enter your username"
          onChangeText={username => this.setState({username})} />
        <TextInput
          style={[styles.form, styles.button]}
          placeholder="Enter your password"
          secureTextEntry={true}
          onChangeText={password => this.setState({password})} />
        <TouchableOpacity 
          style={[styles.button, styles.buttonRed]}
          onPress={this.register.bind(this)}>
          <Text style={styles.buttonLabel}>Register</Text>
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
  buttonRed: {
    backgroundColor: '#FF585B'
  },
  buttonLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: 'white'
  }
});