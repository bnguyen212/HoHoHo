import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  RefreshControl
} from 'react-native';
import { Location, Permissions } from 'expo';

export default class UsersScreen extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    
    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false
    };

    fetch('https://hohoho-backend.herokuapp.com/users')
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success === true) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.users.slice(1))})
      }
    })
    .catch(err => console.log('ERROR:', err));
  }

  // static navigationOptions = (props) => ({
  //   title: 'Users',
  //   headerRight: <Button title='Messages' onPress={() => {props.navigation.navigate('Messages')}} />
  // });

  _onRefresh() {
    this.setState({refreshing: true}, () => {
      const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      fetch('https://hohoho-backend.herokuapp.com/users')
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success === true) {
          this.setState({refreshing: false, dataSource: ds.cloneWithRows(responseJson.users.slice(1))});
        }
      })
      .catch(err => console.log('ERROR:', err));
    });
  }

  touchUser(user) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success === true) {
        alert(`Your message to ${user.username} has been sent!`)
      } else {
        alert(`Failed to message ${user.username}. Please try again later!`)
      }
    })
    .catch(err => console.log('ERROR:', err));
  }

  sendLocation = async(user) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== 'granted') {
      return alert('No permission to access location :(')
    }

    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    this.longTouchUser(user, location);
  }

  longTouchUser(user, location) {
    fetch('https://hohoho-backend.herokuapp.com/messages', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        to: user._id,
        location: {
          longitude: location.coords.longitude,
          latitude: location.coords.latitude,
        }
      })
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success === true) {
        alert(`Your location has been sent to ${user.username}!`)
      } else {
        alert(`Failed to send location to ${user.username}. Please try again later!`)
      }
    })
    .catch(err => console.log('ERROR:', err));
  }

  render() {
    return (
      this.state.dataSource ? 
      <View style={styles.containerFull}>
        <ListView 
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={rowData => <TouchableOpacity onPress={this.touchUser.bind(this, rowData)} 
                                                    onLongPress={this.sendLocation.bind(this, rowData)}
                                                    delayLongPress={1000}
                                                    style={[styles.button, styles.user]}>
                                    <Text style={styles.username}>{rowData.username}</Text>
                                  </TouchableOpacity>}
        />
      </View>
      : null
    )
  }
}

const styles = StyleSheet.create({
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 10,
    marginLeft: '20%',
    marginRight: '20%',
    borderRadius: 5
  },
  user: {
    height: 50, 
    backgroundColor: '#FF585B'
  },
  username: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25
  }
});