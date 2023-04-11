import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    fcmToken();
  }
}

const fcmToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log(fcmToken, 'the Old Token');
  if (!fcmToken) {
    console.log('No token found in storage');
    try {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken, 'the new one');
        await AsyncStorage.setItem('fcmToken', fcmToken); // fix the typo
      }
    } catch (error) {
      console.log('Error in Fcm Token', error);
    }
  }
};

export const notificationListener = async () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.data,
    );
    navigation.navigate(remoteMessage.notification.android.clickAction);
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Message received in foreground', remoteMessage.data);
  });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Received background message:', remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.data,
        );
        // setInitialRoute(remoteMessage.data.type);
      }
      // setLoading(false);
    });
};
