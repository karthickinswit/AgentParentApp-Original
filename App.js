import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Variables from 'chatagentsdk/src/utils/variables';
import {ChatScreen} from 'chatagentsdk/src/utils/globalupdate';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {FAB} from 'react-native-elements';
import JustInTime from 'chatagentsdk/src/screens/JustInScreen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';

const Stack = createStackNavigator();

export default function ChatParent() {
  const deviceTokenRef = useRef('');

  useEffect(() => {
    const mobileType =
      Platform.OS === 'android' ? 0 : Platform.OS === 'ios' ? 1 : -1;
    // console.log('Mobile Type In App.js -----', mobileType)

    if (!firebase.apps.length) {
      firebase.initializeApp({
        // clientId: '90045360180-5d8nfjqs0a5vaeeqssttets2cjjjj5vd.apps.googleusercontent.com',
        appId: '1:90045360180:android:f50ea96a4ca77a0ed68261',
        apiKey: 'AIzaSyB51nbEBuWIcp52UYtyJ0b5QGWzNGf0cuU',
        databaseURL: 'x',
        storageBucket: 'x',
        messagingSenderId: 'x',
        projectId: 'chatapporiginal-d4056',
      });
    } else {
      firebase.app(); // if already initialized, use that one
    }
    requestUserPermission();
    fcmToken();
    notificationListener();
    setTimeout(() => {
      console.log('Device Token In App.js -----', deviceTokenRef.current);
      fetch('https://qa.twixor.digital/moc/e/enterprise/add_deviceId', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deviceType: mobileType,
          registrationId: deviceTokenRef.current,
        }),
      })
        .then(response => {
          if (response.status >= 200 && response.status < 300) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
              return response;
            } else {
              console.log('response ------', response.status);
            }
          } else {
            throw new Error(
              'API Error: Server responded with status ' + response.status,
            );
          }
        })
        .then(() => {})
        .catch(error => {
          console.error('API Error:', error);
          console.log('response ------', error);

        });
    }, 0);
    showLocalNotification();
  });

  function showLocalNotification() {
    let title = '';
    let body = '';

    switch ('customerReplyChat') {
      case 'customerStartChat':
        title = 'New Chat';
        body = 'New chat waiting';
        break;
      case 'waitingInviteAccept':
        title = 'New Chat';
        body = 'You are invited to a chat';
        break;
      case 'waitingTransferAccept':
        title = 'New Chat';
        body = 'New Chat transferred to you';
        break;
      case 'customerReplyChat':
        title = 'New Reply';
        body = 'New reply from customer';
        break;
    }

    if (title) {
      PushNotification.localNotification({
        title: title,
        message: body,
        channelId: 'your-channel-id',
        soundName: "default",
        vibrate: true,
        vibration: 300,
      });
    }
  }

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      fcmToken();
    }
  };

  const fcmToken = async () => {
    let getfcmToken = await AsyncStorage.getItem('fcmToken');
    if (!getfcmToken) {
      try {
        getfcmToken = await messaging().getToken();
        if (getfcmToken) {
          await AsyncStorage.setItem('fcmToken', getfcmToken);
        }
      } catch (error) {
        console.log('Error in Fcm Token', error);
      }
    }
    deviceTokenRef.current = getfcmToken;
  };

  const notificationListener = React.useCallback(navigation => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      navigation.navigate(remoteMessage.notification.android.clickAction);
    });

    messaging().onMessage(async remoteMessage => {
      console.log('Message received in foreground', remoteMessage);
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message received in Background', remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.data,
          );
        }
      });
  });

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BlankPage"
            component={BlankPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="JustInTime"
            component={JustInTime}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const HandleForgotPassword = () => {};

  const ValidateEmail = username => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(username.toLowerCase());
  };

  const HandleLogin = async () => {
    if ((!ValidateEmail(username) && password.length < 8) || username == '') {
    } else if (password.length < 8) {
    } else {
      let res = await LoginApi();
      console.log('res', res);
      Alert.alert(JSON.stringify(res));
      if (res.status) {
        Alert.alert('Attempt Successful');
        console.log(res.response.token);
        navigation.navigate('BlankPage', {
          username: username,
          token: res.response.token,
          uId: res.response.uId,
        });
      } else {
        Alert.alert(res.message.message);
      }
    }
  };

  async function LoginApi() {
    let payload = {};
    payload.email = username;
    payload.password = password;
    payload.removeExistingSession = true;
    payload.routePath = '';
    payload.appId = 'MOC';

    const LoginUri = await fetch(
      `https://qa.twixor.digital/moc/account/enterprise/login/twoFactorAuth?email=${encodeURIComponent(
        payload.email,
      )}&&password=${encodeURIComponent(
        payload.password,
      )}&removeExistingSession=${encodeURIComponent(
        payload.removeExistingSession,
      )}&routePath=&appId=${encodeURIComponent(payload.appId)}`,
      {
        crossDomain: true,
        method: 'POST',
      },
    );
    const LoginResponse = await LoginUri.json();

    return LoginResponse;
  }

  return (
    <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={styles.logo} />
      <TextInput
        style={styles.input}
        placeholder="User Id"
        onChangeText={setUsername}
        value={username}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={styles.submitButton} onPress={HandleLogin}>
        <Text style={styles.submitButtonText}> Login </Text>
      </TouchableOpacity>
    </View>
  );
};

BlankPage = ({route}) => {
  const navigation = useNavigation();
  let chat = {};

  chat['messages'] = [
    {
      id: '0',
      sender: 'me',
      text: ' yErLtR',
      timestamp: '9:00 AM',
    },
    {
      id: '1',
      sender: 'me',
      text: ' tnQCG6',
      timestamp: '9:00 AM',
    },
    {
      id: '2',
      sender: 'me',
      text: ' 2s0roJ',
      timestamp: '9:00 AM',
    },
    {
      id: '3',
      sender: 'me',
      text: ' 8t45cX',
      timestamp: '9:00 AM',
    },
    {
      id: '4',
      sender: 'me',
      text: ' YfOW49',
      timestamp: '9:00 AM',
    },
    {
      id: '5',
      sender: 'me',
      text: ' Svaypi',
      timestamp: '9:00 AM',
    },
    {
      id: '6',
      sender: 'me',
      text: ' IDetTs',
      timestamp: '9:00 AM',
    },
    {
      id: '7',
      sender: 'me',
      text: ' 6JOXfg',
      timestamp: '9:00 AM',
    },
    {
      id: '8',
      sender: 'me',
      text: ' o7qY03',
      timestamp: '9:00 AM',
    },
    {
      id: '9',
      sender: 'me',
      text: ' zCA9oJ',
      timestamp: '9:00 AM',
    },
  ];

  const propDetails = {
    name: route.params.username,
    token: route.params.token,
    userId: route.params.uId,
    baseUrl: 'https://qa.twixor.digital/moc',
  };

  const HandleClick = async () => {
    Variables.API_URL = propDetails.baseUrl;
    Variables.TOKEN = propDetails.token;

    navigation.navigate('ChatScreen', {
      userDetails: propDetails,
    });
  };
  const hanleJustInTime = async () => {
    Variables.API_URL = propDetails.baseUrl;
    Variables.TOKEN = propDetails.token;

    navigation.navigate('JustInTime', {
      userDetails: propDetails,
    });
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={{marginBottom: 20}}> Hello {route.params.username} </Text>
        <View style={{height: 300}}></View>
        <FAB
          title="Just In Time"
          style={styles.floatinRightBtn}
          onPress={hanleJustInTime}
        />
        <FAB
          title="start Messaging"
          style={styles.floatinBtn}
          onPress={HandleClick}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 40,
  },
  form: {
    width: '80%',
  },
  input: {
    backgroundColor: '#F2F2F2',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: '80%',
  },
  submitButton: {
    backgroundColor: '#217eac',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
  },
  submitButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  floatinBtn: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  floatinRightBtn: {
    backgroundColor: 'blue',
    position: 'absolute',
    bottom: 10,
    left: 10,
  },
});
