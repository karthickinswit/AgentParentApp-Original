import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState} from 'react';

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    fcmToken();
  }
};

export const fcmToken = async () => {
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

export const notificationListener = React.useCallback(navigation => {
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

const TEST_API = 'https://63bfe4bea177ed68abbaa502.mockapi.io/chatlist';

export async function testChats() {
  const response = await fetch(TEST_API);
  const testdata = await response.json();
  return testdata;
}
