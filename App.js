import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Variables from 'chatagentsdk/src/utils/variables';
import {ChatScreen} from 'chatagentsdk/src/utils/globalupdate';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import JustInTime from 'chatagentsdk/src/screens/JustInScreen';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';

const Stack = createStackNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    'Message received in Background',
    remoteMessage.notification.body,
  );
});

export default function ChatParent() {
  const deviceTokenRef = useRef('');

  useEffect(() => {
    const mobileType =
      Platform.OS === 'android' ? 0 : Platform.OS === 'ios' ? 1 : -1;
    !firebase.apps.length
      ? firebase.initializeApp({
          appId: '1:584671962460:android:e3953e51e628066a844d99',
          apiKey: 'AIzaSyClYkkEi7IvXOLzTf_v9cX3SvZrwEc5nck',
          databaseURL: 'x',
          storageBucket: 'twixorchatagentsdk.appspot.com',
          messagingSenderId: 'x',
          projectId: 'twixorchatagentsdk',
        })
      : firebase.app();

    requestUserPermission();
    fcmToken();
    notificationListener();
    setTimeout(() => {
      console.log('Device Token In App.js -----', deviceTokenRef.current);
      fetch('https://dc67-210-18-155-241.ngrok-free.app/MeOnCloud/e/enterprise/add_deviceId', {
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
              console.log('response in API ------', response);
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
    //showLocalNotification();
  });

  function showLocalNotification() {
    let title = '';
    let body = '';

    switch ('waitingInviteAccept') {
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
        soundName: 'default',
        vibrate: true,
        vibration: 500,
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

  const notificationListener = React.useCallback(() => {

    messaging().onNotificationOpenedApp(remoteMessage => {
      const navigation = useNavigation();
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.data,
      );
      navigation.navigate(remoteMessage.notification.android.clickAction);
    });

    messaging().onMessage(async remoteMessage => {
      console.log(
        'Message received in foreground',
        remoteMessage.notification,
      );
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'Message received in Background',
        remoteMessage.notification,
      );
      // let title = '';
      // let body = '';

      // switch ('customerReplyChat') {
      //   case 'customerStartChat':
      //     title = 'New Chat';
      //     body = 'New chat waiting';
      //     break;
      //   case 'waitingInviteAccept':
      //     title = 'New Chat';
      //     body = 'You are invited to a chat';
      //     break;
      //   case 'waitingTransferAccept':
      //     title = 'New Chat';
      //     body = 'New Chat transferred to you';
      //     break;
      //   case 'customerReplyChat':
      //     title = 'New Reply';
      //     body = 'New reply from customer';
      //     break;
      // }

      // if (title) {
      //   PushNotification.localNotification({
      //     title: remoteMessage.notification.title,
      //     message: remoteMessage.notification.body,
      //     channelId: 'your-channel-id',
      //     soundName: 'default',
      //     vibrate: true,
      //     vibration: 300,
      //   });
      // }
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
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigation = useNavigation();

  const ValidateEmail = username => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(username.toLowerCase());
  };

  const HandleLogin = async () => {
    setIsLoading(true);
    setIsError(false);
    if ((!ValidateEmail(username) && password.length < 8) || username == '') {
      setIsLoading(false);
    } else if (password.length < 2) {
      setIsLoading(false);
    } else {
      let res = await LoginApi();
      if (res.status && res.response.token) {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          navigation.navigate('BlankPage', {
            username: username,
            token: res.response.token,
            uId: res.response.uId,
          });
        }, 10);
      } else {
        setIsError(true);
        setIsLoading(false);
      }
    }
  };

  const handleRetry = () => {
    setIsError(false);
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
      {isError ? (
        <TouchableOpacity style={styles.submitButton2} onPress={handleRetry}>
          <Text style={styles.submitButtonText}>
            Invalid Credentials. Try Again!
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={isSuccess ? styles.submitButton1 : styles.submitButton}
          onPress={HandleLogin}>
          <Text style={styles.submitButtonText}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : isSuccess ? (
              'Login Successful'
            ) : isError ? (
              'Error'
            ) : (
              'Login'
            )}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

BlankPage = ({route}) => {
  const navigation = useNavigation();

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
      <Text style={styles1.helloText}>Hello {route.params.username}</Text>
      <View style={styles1.containerNewFab}>
        <TouchableOpacity
          style={styles1.buttonNewFab}
          onPress={hanleJustInTime}>
          <Text style={styles1.textNewFab}>JIT</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles1.buttonNewFab, styles1.secondaryNewFab]}
          onPress={HandleClick}>
          <Text style={styles1.textNewFab}>SM</Text>
        </TouchableOpacity>
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
  submitButton1: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '80%',
  },
  submitButton2: {
    backgroundColor: '#cc0000',
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

const styles1 = StyleSheet.create({
  containerNewFab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
  },
  buttonNewFab: {
    backgroundColor: '#2196F3',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryNewFab: {
    backgroundColor: '#FFC107',
  },
  textNewFab: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  helloText: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
