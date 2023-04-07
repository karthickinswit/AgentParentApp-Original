import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import {useNavigation, StackActions} from '@react-navigation/native';

import {messageService} from '../services/websocket';
const {height} = Dimensions.get('screen');
import {GlobalContext} from '../utils/globalupdate';
import {timeConversion} from '../utils/utilities';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from 'react-native-popup-menu';

import {closeChat} from '../services/api';
import {useEffect} from 'react';
let flatList = React.useRef(null);

const ClosedChatView = route => {
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const value = React.useContext(GlobalContext);

  console.log('Loading Value--> ', JSON.stringify(value));

  //   let chatId = route.route.params.chatId;
  //   let chat = value.activeChatList.current.find(response => {
  //     return response.chatId == chatId;
  //   });

  let chat = route.route.params.item;

  console.log('Chat using context', JSON.stringify(route));

  //console.log('In individual chatparams-->', route.route.params.chatId);

  console.log('In individual chat-->', JSON.stringify(chat));

  let ChatHeader = () => {
    const navigation = useNavigation();

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              //  navigation.dispatch(StackActions.popToTop())
              console.log(navigation.canGoBack());

              navigation.replace('ChatListPage');
              // navigation.goBack()
              // navigation.dispatch(StackActions.pop(1))
            }}>
            <Image
              source={require('../../assets/chevron-left-solid.png')}
              style={{width: 30, height: 30, borderRadius: 30}}
            />
          </TouchableOpacity>
          <View style={styles.leftContainer}>
            {chat.customerIconUrl ? (
              <Image
                source={{uri: chat.customerIconUrl}}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require('../../assets/boy_dummy.png')}
                style={styles.avatar}
              />
            )}
            {/* <Image source={{uri: chat.customerIconUrl}} style={styles.avatar} /> */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>{chat.customerName}</Text>
              <Text style={styles.subtitle}>{}</Text>
            </View>
          </View>
          <View></View>
          <TouchableOpacity
            onPress={() => {
              closeChat(chat.chatId);
              console.log('Chat closed');
              console.log(navigation.canGoBack());
              //navigation.goBack()
              navigation.replace('ChatListPage');
              //navigation.replace('ChatListPage');
            }}>
            {/* <View
              style={{
                paddingBottom: 5,
                width: 60,
                backgroundColor: '#5CB3FF',
                borderRadius: 6,
                paddingLeft: 5,
                elevation: 3,
              }}>
              <Text
                style={{fontSize: 14, color: 'white', alignItems: 'center'}}>
                Close Chat
              </Text>

            
            </View> */}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  let ChatBody = () => {
    let renderMessage = ({item, index}) => {
      return (
        <ScrollView>
          {item.actionType == 0 || item.actionType == 1 ? (
            <View style={styles.messageSent}>
              <Text style={styles.messageText} key={index}>
                {item.message}
              </Text>
              <Text style={styles.timestampText}>
                {timeConversion(item.actedOn)}
              </Text>
            </View>
          ) : item.actionType == 2 ? (
            <View style={styles.messageHeader}>
              <Text style={styles.messageText} key={index}>
                {item.messager ? 'You' : item.message} joined chat
              </Text>
            </View>
          ) : item.actionType == 4 ? (
            <View style={styles.messageHeader}>
              <Text style={styles.messageText} key={index}>
                {item.message ? 'You' : item.message} transferred chat To You
              </Text>
            </View>
          ) : item.actionType == 8 ? (
            <View style={styles.messageHeader}>
              <Text style={styles.messageText} key={index}>
                {item.message ? 'You' : item.message} left this chat
              </Text>
            </View>
          ) : item.actionType == 9 ? (
            <View style={styles.messageHeader}>
              <Text style={styles.messageText} key={index}>
                {item.message ? 'You' : item.message} left this chat
              </Text>
            </View>
          ) : item.actionType == 3 ? (
            <View style={styles.messageReceived}>
              <Text style={styles.messageText} key={index}>
                {item.message}
              </Text>
              <Text style={styles.timestampText}>
                {timeConversion(item.actedOn)}
              </Text>
            </View>
          ) : (
            <View></View>
          )}
        </ScrollView>
      );
    };
    if (chat.messages) {
      return (
        <FlatList
          data={chat.messages}
          renderItem={renderMessage}
          keyExtractor={item => item.actionId.toString()}
          contentContainerStyle={styles.contentContainer}
          legacyImplementation={true}
          extraData={true}
          ref={flatList}
          onContentSizeChange={() => flatList.current.scrollToEnd()}
        />
      );
    } else {
      return <Text> Loading.....</Text>;
    }
  };

  let ChatFooter = () => {
    let [message, setMessage] = React.useState('');

    let handleSendMessage = () => {
      console.log(message);
      const sendObject = {
        action: 'agentReplyChat',
        eId: chat.eId,
        message: message,
        contentType: 'TEXT',
        chatId: chat.chatId,
        attachment: {},
        pickup: false,
      };
      console.log('send Object', sendObject);
      messageService.sendMessage(sendObject);
      setMessage('');
    };

    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.attachmentButton}>
            <Image
              source={require('../../assets/add_128.png')}
              style={styles.attachmentIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message"
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendMessage}>
            <Image
              source={require('../../assets/send_128.png')}
              style={styles.sendIcon}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  useEffect(() => {
    return () => {
      // Anything in here is fired on component unmount.
      console.log('Component will leave');
    };
  });

  return (
    <>
      <ChatHeader />
      <ChatBody />
    </>
  );
};

let styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    borderBottomColor: '#DDDDDD',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 24,
    height: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  textContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: 'gray',
  },
  menuButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    padding: 40,
  },
  messageSent: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'flex-end',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageHeader: {
    backgroundColor: '#ecf6fd',
    alignSelf: 'center',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageReceived: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
  },
  timestampText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  footerContainer: {
    position: 'absolute',

    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  attachmentButton: {
    marginRight: 16,
  },
  attachmentIcon: {
    width: 24,
    height: 24,
  },
  input: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 150,
  },
  sendButton: {
    marginLeft: 16,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
  },
});

export default ClosedChatView;
