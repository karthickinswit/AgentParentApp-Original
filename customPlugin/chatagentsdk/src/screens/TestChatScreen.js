import React, {
  useEffect,
  useState,
  useContext,
  useRef,
} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Animated,
  Modal,Pressable
} from 'react-native';
//import {Tab, TabView} from '@rneui/themed';
import {useNavigation, useRoute} from '@react-navigation/native';
import { TabView, SceneMap } from 'react-native-tab-view';

import {messageService} from '../services/websocket';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
  MenuContext
} from 'react-native-popup-menu';
import {GlobalContext} from '../utils/globalupdate';
import {activeChats, closedChats} from '../services/api';
import {ActivityIndicator} from 'react-native-paper';

let elementRef = React.createRef();
let Memo = () => {
  const navigation = useNavigation();
  console.log('Side menu Clicrked');
  return (
    <Menu
      name="SideMenu"
      onOpen={console.log('Menu opened')}
      onBackdropPress={console.log('On menu closed')}
      style={{
        position: 'absolute',
        top: 0,
        right: 15,
        justifyContent: 'center',
      }}>
      <MenuTrigger>
        <Image
          source={require('../../assets/inside_menu_64.png')}
          style={{height: 30, width: 8}}
        />
      </MenuTrigger>
      <MenuOptions
        optionsContainerStyle={{
          paddingLeft: 40,
          height: 180,
          width: 150,
          flexDirection: 'column',
          borderRadius: 15,
          alignContent: 'flex-start',
        }}>
        <MenuOption style={{}} onSelect={() => alert('No New chats')}>
          <Text style={styles.statusText}>New Chats - 0</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert('No Transferred Chats')}
          disabled={true}>
          <Text style={styles.statusText}>Transferred Chat</Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            navigation.replace('JustInTime');
          }}>
          <Text style={styles.statusText}>Just In Time</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  );
};
let NotifyModal = () => {
  const navigation = useNavigation();
  console.log('Side menu Clicrked');
  return (
    <MenuOptions
      optionsContainerStyle={{
        paddingLeft: 40,
        height: 180,
        width: 150,
        flexDirection: 'column',
        borderRadius: 15,
        alignContent: 'flex-start',
      }}>
      <MenuOption style={{}} onSelect={() => alert('No New chats')}>
        <Text style={styles.statusText}>New Chats - 0</Text>
      </MenuOption>
      <MenuOption
        onSelect={() => alert('No Transferred Chats')}
        disabled={true}>
        <Text style={styles.statusText}>Transferred Chat</Text>
      </MenuOption>
      <MenuOption
        onSelect={() => {
          navigation.replace('JustInTime');
        }}>
        <Text style={styles.statusText}>Just In Time</Text>
      </MenuOption>
    </MenuOptions>
  );
};
let ChatHeader = () => {
  let blink = useRef(true);

  const [index, setIndex] = React.useState(0);
  const value = useContext(GlobalContext);
  console.log('Header', JSON.stringify(value));
  const [emptyState, setEmptyState] = useState({});
  const isNotifyMenu = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {
    // Change the state every second or the time given by User.
    let interval = new setInterval(() => {
      //  setBlink(blink => !blink);
      blink.current = blink.current ? true : false;
     // setEmptyState(blink.current);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  //useEffect(() => {}, [emptyState]);

  return (
    <View style={[styles.header]} ref={elementRef}>
      <View style={styles.left}>
        <Image
          source={require('../../assets/twixor_hd_icon.png')}
          style={styles.logo}
        />
        <View style={styles.status}>
          <Text style={styles.logotext}>Chats </Text>
          <View
            style={[styles.statusIndicator, {backgroundColor: '#5ED430'}]}
          />
          <Text style={styles.statusText}>Online</Text>
        </View>
      </View>
      <View style={[styles.right]}>
        <Image
          source={require('../../assets/search_64.png')}
          style={styles.icon}
        />
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={()=>{setModalVisible(true)}}>
      <View style={styles.badgeSetup}>
              <Image
                source={require('../../assets/notification_64.png')}
                style={styles.icon}
              />
              {value.newChatCount.current > 0 ? (
                <View
                  style={[
                    {
                      position: 'absolute',
                      backgroundColor: 'red',
                      width: 16,
                      height: 16,
                      borderRadius: 15 / 2,
                      right: 10,
                      top: +5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    {display: blink.current ? 'flex' : 'none'},
                  ]}>
                  <Text
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 8,
                    }}>
                    {value.newChatCount.current}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
      </TouchableOpacity>
        {/* <Menu
          style={{backfaceVisibility: 'visible'}}
          name="notifyMenu"
          onBackdropPress={console.log('on close menu')}>
          <MenuTrigger onPress={console.log('Bell icon pressed')}>
            <View style={styles.badgeSetup}>
              <Image
                source={require('../../assets/notification_64.png')}
                style={styles.icon}
              />
              {value.newChatCount.current > 0 ? (
                <View
                  style={[
                    {
                      position: 'absolute',
                      backgroundColor: 'red',
                      width: 16,
                      height: 16,
                      borderRadius: 15 / 2,
                      right: 10,
                      top: +5,
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    {display: blink.current ? 'flex' : 'none'},
                  ]}>
                  <Text
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FFFFFF',
                      fontSize: 8,
                    }}>
                    {value.newChatCount.current}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          </MenuTrigger>
          <MenuOptions
            ref={elementRef}
            optionsContainerStyle={{
              paddingLeft: 10,
              paddingTop: 20,
              height: 200,
              width: 150,
              flexDirection: 'column',
              borderRadius: 15,
              alignContent: 'flex-start',
              backgroundColor: '#30cb24',
              borderStyle: 'solid',
            }}>
            <MenuOption
              style={{borderColor: 'red'}}
              onSelect={() => {
                if (value.newChatCount.current == 0) {
                  alert('No New chats');
                } else {
                  const sendObject = {action: 'agentPickupChat', chatId: ''};
                  console.log('send Object', sendObject);
                  messageService.sendMessage(sendObject);
                }
              }}>
             
            </MenuOption>
            <MenuOption
              onSelect={() => alert('No Transferred Chats')}
              disabled={true}>
              <Text style={styles.menuOptionText}>
                Transferred Chat -{' '}
                {value.transferredChatCount.current.toString()}{' '}
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                //navigation.replace('JustInTime');
              }}>
              <Text style={styles.menuOptionText}>
                Invite Chats - {value.invitedChatCount.current.toString()}{' '}
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                //navigation.replace('JustInTime');
              }}>
              <Text style={styles.menuOptionText}>
                Assigned Chats - {value.newChatCount.current.toString()}{' '}
              </Text>
            </MenuOption>
            <MenuOption
              onSelect={() => {
                //navigation.replace('JustInTime');
              }}>
              <Text style={styles.menuOptionText}>
                Missed Chats - {value.missedChatCount.current.toString()}{' '}
              </Text>
            </MenuOption>
          </MenuOptions>
        </Menu> */}

        <View
          style={{
            paddingBottom: 30,
            width: 50,
          }}>
          <Memo />
        </View>
      </View>
    </View>
  );
};
const ChatHeaderMemo=React.memo(ChatHeader);



export const ActiveChats = () => {
  const navigation = useNavigation();
  // setTimeout(() => {
  const value = useContext(GlobalContext);

  console.log('Active chat tab-->', value);

  useEffect(() => {
    if (value.activeChatList.current.length <= 0) {
      activeChats()
        .then(data => {
          console.log('active data-->', data);

          value.activeChatList.current = data.chats;

          console.log('Chats in Global update2', value.activeChatList.current);
        })
        .catch(error => console.error('Error:', error));
    }
    // if (value.closedChatList.current.length <= 0) {
    //   closedChats()
    //     .then(data => {
    //       console.log('close data-->', data);

    //       value.closedChatList.current = data.chats;

    //       console.log(
    //         'closed Chats in Global update2',
    //         value.closedChatList.current,
    //       );
    //     })
    //     .catch(error => console.error('Error:', error));
    // }
  });

  const tempList = React.useMemo(() => {
    return value.activeChatList;
  }, [tempList]);
  if (tempList.current.length > 0) {
    // console.log('ChatList', JSON.stringify(tempList.current));
    return (
      
      <ScrollView>
        {tempList.current.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                //navigation.setParams({'chats':item});
                navigation.replace('IndividualChat', {chatId: item.chatId});
              }}>
              <View style={styles.item}>
                <Image
                  source={{uri: item.customerIconUrl}}
                  style={styles.avatar}
                />
                <View style={styles.details}>
                  <Text style={styles.name}>{item.customerName}</Text>
                  <Text style={styles.lastMessage} key={index}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.time}>{item.time}</Text>
                  {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  } else {
    return <Text> Loading.....</Text>;
  }
};
export const ClosedChats = () => {
  const navigation = useNavigation();

  //const value = useContext(GlobalContext);
  
  const[closedList,setClosedList]=useState(()=>{
    closedChats()
  .then(data => {
    console.log('close data-->', data);
    setClosedList(data.chats)
    

    
  })
  .catch(error => console.error('Error:', error));
  });

 // console.log('close chat tab-->', value);

// useEffect(()=>{
//   closedChats()
//   .then(data => {
//     console.log('close data-->', data);
//     setClosedList(data.chats)
    

//     console.log(
//       'closed Chats in Global update2',
//      // value.closedChatList.current,
//     );
//   })
//   .catch(error => console.error('Error:', error));
// },[])
    
    
  

  // const tempList = React.useMemo(() => {
  //   return closedList;
  // }, [tempList]);
  if (closedList) {
    console.log('ChatList', JSON.stringify(closedList));
    return (
      // <Text>Closed Chats list</Text>
      <ScrollView>
        {closedList.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                navigation.navigate('ClosedChatView', {item});
              }}>
              <View style={styles.item}>
              { item.customerIconUrl?
                <Image
                  source={{uri: item.customerIconUrl}}
                  style={styles.avatar}
                />:<Image
                  source={require('../../assets/boy_dummy.png')}
                  style={styles.avatar}
                />
              }
                <View style={styles.details}>
                  <Text style={styles.name}>{item.customerName}</Text>
                  <Text style={styles.lastMessage} key={index}>
                    {item.messages[item.messages.length - 1].message}
                  </Text>
                </View>
                <View style={styles.info}>
                  <Text style={styles.time}>{item.time}</Text>
                  
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  } else {
    return <Text> Loading.....</Text>;
  }
};
const ActiveChatMemo=React.memo(ActiveChats);
const ClosedChatsMemo=React.memo(ClosedChats);
let Tabs = () => {
  const [index, setIndex] = React.useState(0);
  //   let chats=props.value;
  React.useEffect(() => {
    //console.log('tabs called everytime',JSON.stringify(props));
  });
  //console.log('chats in tab ',JSON.stringify (props));

  return (
    <>
      <Tab renderToHardwareTextureAndroid={true}
        value={index}
        onChange={e => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'white',
          height: 3,
          borderBottomWidth: 2,
          borderBottomColor: '#2f81ad',
        }}
        variant="transparent">
        <Tab.Item
          title="Active Chats"
          titleStyle={{fontSize: 15, color: '#2f81ad'}}
        />
        <Tab.Item
          title="Closed Chats"
          titleStyle={{fontSize: 15, color: 'gray'}}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} disableSwipe="false" animationType='timing' >
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          <ActiveChatMemo />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'white', width: '100%'}}>
          
            <ClosedChatsMemo />
          
        </TabView.Item>
      </TabView>
    </>
  );
};
const renderScene = SceneMap({
  active: ActiveChats,
  closed: ClosedChats,
});
const TabMemo=React.memo(Tabs);
const ChatListPage = chats => {
  console.log('re render issue testchatList', JSON.stringify(chats));
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
  
        
 // const value = useContext(GlobalContext);

  return (
    
      <MenuContext>
      <ChatHeaderMemo  />
      <TabView
  navigationState={{ index, routes }}
  onIndexChange={setIndex}
  renderScene={renderScene}
/>
      {/* <TabMemo /> */}
      </MenuContext>
    
  );
};

let styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  chatBodyContainer: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingHorizontal: 16,
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
    marginTop: 10,
    marginLeft: 7,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555555',
    marginTop: 8,
  },
  menuOptionText:{
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 8,
  },
  logotext: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555555',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeSetup: {
    // flexDirection: 'row',
    // alignItems: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#777777',
  },
  info: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 4,
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  item1: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
};

export default ChatListPage;
