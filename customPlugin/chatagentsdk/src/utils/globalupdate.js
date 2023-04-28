import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from 'react';
import { View, BackHandler, Text } from 'react-native';
import ChatListPage from '../screens/ChatScreen';
import { messageService } from '../services/websocket';
import Variables from '../utils/variables';
import websocket from '../../src/services/websocket';
import IndividualChat from '../screens/IndividualChat';
import Conversation from '../screens/Conversation';
import MenuExample from '../screens/TestScreen';
import JustInTime from '../screens/JustInScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

export const GlobalContext = createContext();
const Stack = createStackNavigator();
import useStates from '../providers/stateProvider';
import TestSecond from '../screens/TestScreenSecond';
import TestIndividualChat from '../screens/TestIndividualChat';
import ClosedChatView from '../screens/ClosedChatView';
import { ActivityIndicator } from 'react-native-paper';

export const ChatScreen = ({ route }) => {
  const [isSocketConnected, setSocketConnection] = useState(false);
  const activeChatList = useRef([]);
  const closedChatList = useRef([]);
  const [users, SetUsers] = useState();
  const newChatCount = useRef(0);
  const invitedChatCount = useRef(0);
  const transferredChatCount = useRef(0);
  const missedChatCount = useRef(0);
  const assignedChatCount = useRef(0);
  const [socketResponse, setSocketResponse] = useState({});
  const socketListener = React.useRef();

  console.log(JSON.stringify(route.params.userDetails));

  Variables.API_URL = route.params.userDetails.baseUrl;
  Variables.TOKEN = route.params.userDetails.token;
  Variables.AgentId = route.params.userDetails.userId;
  Variables.ACTIVE_CHATS = '/e/enterprise/chat/summary';
  Variables.CLOSED_CHATS = '/e/enterprise/chat/history?state=3';
  Variables.SUSPENDED_CHATS =
    '/e/enterprise/chat/history?state=5&agent=' + Variables.AgentId.toString();

  useEffect(() => {
    console.log('socket Instance', websocket.checkInstance());
    if (!websocket.checkInstance()) {
      websocket.connect();
      websocket.waitForSocketConnection(() => { });
    }
  }, []);
  function handleBackButtonClick() {
    console.log('Navigation back button clicked');
    socketListener.current.unsubscribe();
    setSocketConnection(false);
    activeChatList.current = [];
    websocket.socketRef = null;
    return false;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);

  useEffect(() => {
    socketListener.current = messageService.getMessage().subscribe(data => {
      var obj = JSON.parse(data);
      console.log('socket Instance2', websocket.checkConnection());
      console.log('globListen', obj.action);

      if (obj.action === 'onOpen') {
        var content = obj.content[0];
        if (content.response && content.response.enterprise) {
          var enterprise = content.response.enterprise;
          console.log(enterprise);
          newChatCount.current = enterprise.unPickedCount;
          missedChatCount.current = enterprise.missedCount;
          transferredChatCount.current = enterprise.transferredCount;
          invitedChatCount.current = enterprise.invitedCount;
          setSocketConnection(true);
        }
      } else if (obj.action === 'customerStartChat') {
        newChatCount.current = newChatCount.current + 1;
        setSocketResponse(obj);
      } else if (obj.action === 'agentPickupChat') {
        if (obj.content) {
          var newChat = obj.content[0].response.chat;
          activeChatList.current.chats = [
            ...activeChatList.current.chats,
            newChat,
          ];
          newChatCount.current = newChatCount.current - 1;
          setSocketResponse(obj);
        }
      } else if (obj.action === 'agentEndChat') {
        var res = obj.content[0].response;
        var chatId = res.chat.chatId;
        activeChatList.current.chats.splice(
          activeChatList.current.chats.findIndex(
            chat => chat.chatId === chatId,
          ),
          1,
        );

        setSocketResponse(obj);
      } else if (obj.action === 'customerReplyChat') {
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else if (obj.action === 'agentReplyChat') {
        chatMessageUpdate(obj);
        setSocketResponse(obj);
      } else {
      }
    });
    return () => {
      socketListener.current.unsubscribe();
      setSocketConnection(false);
    };
  }, []);
  useEffect(() => {
    console.log('Chat list updated-- ', JSON.stringify(activeChatList.current));
  }, [socketResponse]);

  function chatMessageUpdate(obj) {
    var res = obj.content[0].response;
    var chatId = res.chat.chatId;
    var messages = res.chat.messages;

    if (activeChatList.current.chats.length > 0) {
      var currentChat = activeChatList.current.chats.find(response => {
        return response.chatId == chatId;
      });
      console.log('before Updating current', JSON.stringify(currentChat));
      var concatMesssgaes = [...currentChat.messages, ...messages];
      var newChatMessages = [
        ...new Map(concatMesssgaes.map(item => [item.actionId, item])).values(),
      ];

      currentChat['messages'] = newChatMessages;

      var newChats = activeChatList.current.chats.map(chat =>
        chat.chatId !== chatId ? chat : currentChat,
      );

      activeChatList.current.chats = newChats;
      console.log(
        'After Updating current',
        JSON.stringify(activeChatList.current),
      );
    } else {
      console.log('No Active Chats');
    }
  }

  return isSocketConnected ? (
    <GlobalContext.Provider
      value={{
        activeChatList,
        newChatCount,
        missedChatCount,
        transferredChatCount,
        invitedChatCount,
        assignedChatCount,
        closedChatList,
      }}>
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          <Stack.Screen name="ChatListPage" options={{ headerShown: false }}>
            {props => <ChatListPage {...props} />}
          </Stack.Screen>
          <Stack.Screen name="IndividualChat" options={{ headerShown: false }}>
            {props => <IndividualChat {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Conversation" options={{ headerShown: false }}>
            {props => (
              <Conversation {...props} initialParams={{ chatUser, users }} />
            )}
          </Stack.Screen>
          <Stack.Screen name="MenuExample" options={{ headerShown: false }}>
            {props => <MenuExample {...props} />}
          </Stack.Screen>
          <Stack.Screen name="JustInTime" options={{ headerShown: false }}>
            {props => <JustInTime {...props} />}
          </Stack.Screen>
          <Stack.Screen name="TestSecond" options={{ headerShown: false }}>
            {props => <TestSecond {...props} />}
          </Stack.Screen>
          <Stack.Screen
            name="TestIndividualChat"
            options={{ headerShown: false }}>
            {props => <TestIndividualChat {...props} />}
          </Stack.Screen>
          <Stack.Screen name="ClosedChatView" options={{ headerShown: false }}>
            {props => <ClosedChatView {...props} />}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalContext.Provider>
  ) : (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        hidesWhenStopped={isSocketConnected}
        size="large"
        color="#217eac"></ActivityIndicator>
      <Text style={{ marginTop: 10 }}>Loading</Text>
    </View>
  );
};

export const useGlobalData = () => useContext(GlobalContext);
