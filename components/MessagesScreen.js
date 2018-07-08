import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ListView,
  AsyncStorage,
  RefreshControl
} from 'react-native';
import moment from 'moment';
import { MapView } from 'expo';

export default class MessagesScreen extends React.Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: ds.cloneWithRows([]),
      refreshing: false,
    }

    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success === true) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.messages)})
      }
    })
    .catch(err => console.log('ERROR:', err));

    AsyncStorage.getItem('user').then(result => this.setState({currentUser: JSON.parse(result).username}));
  }


  _onRefresh() {
    this.setState({refreshing: true});
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    fetch('https://hohoho-backend.herokuapp.com/messages')
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.success === true) {
        this.setState({dataSource: ds.cloneWithRows(responseJson.messages)});
        this.setState({refreshing: false});
      }
    })
    .catch(err => console.log('ERROR:', err));
  }

  render() {
    return (
      <View style={styles.containerFull}>
        <ListView 
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />}
          dataSource={this.state.dataSource}
          enableEmptySections={true}
          renderRow={(message) => {
            if (this.state.currentUser === message.from.username) {
              return (
                <View style={[styles.button, styles.buttonGreen, styles.message, styles.fromUserMsg]}>
                  <Text style={styles.text}>To: {message.to.username}</Text>
                  <Text style={styles.text}>{moment(new Date(message.timestamp), 'YYYY-MM-DDThh:mm:ss.SSSZ').format("[Sent on] ddd M/D/YYYY [at] h:mm A")}</Text>
                  <Text style={styles.text}>Message: {message.body}</Text>
                  {message.location ? (
                    <MapView style={styles.container} region={{
                      latitude: message.location.latitude,
                      longitude: message.location.longitude,
                      latitudeDelta: 0.125,
                      longitudeDelta: 0.125
                    }}>
                      <MapView.Marker
                        coordinate={message.location} />
                    </MapView>) : <Text/>}
                </View>
              )
            } else {
              return (
                <View style={[styles.button, styles.buttonBlue, styles.message, styles.toUserMsg]}>
                  <Text>From: {message.from.username}</Text>
                  <Text>{moment(new Date(message.timestamp), 'YYYY-MM-DDThh:mm:ss.SSSZ').format("[Sent on] ddd M/D/YYYY [at] h:mm A")}</Text>
                  <Text>Message: {message.body}</Text>
                  {message.location ? (
                    <MapView style={styles.container} region={{
                      latitude: message.location.latitude,
                      longitude: message.location.longitude,
                      latitudeDelta: 0.125,
                      longitudeDelta: 0.125
                    }}>
                      <MapView.Marker
                        coordinate={message.location} />
                    </MapView>) : <Text/>}
                </View>
              )
            }
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: 150
  },
  containerFull: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
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
    backgroundColor: '#0074D9',
  },
  buttonGreen: {
    backgroundColor: '#2ECC40'
  },
  message: {
    paddingLeft: 15,
    paddingRight: 15
  },
  toUserMsg: {
    marginRight: 150
  },
  fromUserMsg: {
    marginLeft: 150
  },
  text: {
    color: 'white'
  }
});