import React, {useContext,useState} from 'react';
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
} from 'react-native';
import {useNavigation,StackActions} from '@react-navigation/native';
import Variables from '../utils/variables';
import {messageService} from '../services/websocket';
const {height} = Dimensions.get('screen');
import { GlobalContext } from '../utils/globalupdate';
import { timeConversion } from '../utils/utilities';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider
 } from 'react-native-popup-menu';

 import { closeChat } from '../services/api';
// let flatList = React.useRef(null);
// let val=0;
// MemoContext=React.createContext();
const TestIndividualChat = (route) => {
    const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.log("Height --> ",windowHeight);
console.log("Width --> ",windowWidth);
let size=windowHeight-(40+35);
console.log("Space area",size)

    return(
      <MenuProvider>
        <View style={{flex:1}}>
        <View style={{padding:35,backgroundColor:'red'}}>
        <Menu style={{}}>
        <MenuTrigger>
          
            <Image
              source={require('../../assets/inside_menu_64.png')}
              style={[styles.icon,{height:40, width: 30}]}
            />
            
              
            
            {/* <Badge count={props.value.newChatCount} /> */}
          
          </MenuTrigger>
          <MenuOptions
        optionsContainerStyle={{
          paddingLeft: 10,
          paddingTop:20,
          height: 40,
          width: 60,
          flexDirection: 'column',
          borderRadius: 15,
          alignContent: 'flex-start',
          backgroundColor:'#30cb24',
          borderStyle:'solid'
        }}>
        <MenuOption style={{borderColor:'red'}} onSelect={() => alert('No New chats')}>
          <Text style={styles.statusText}>Live Chats  </Text>
        </MenuOption>
        <MenuOption
          onSelect={() => alert('No Transferred Chats')}
          disabled={true}>
          <Text style={styles.statusText}>Transferred Chat -  </Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            //navigation.replace('JustInTime');
          }}>
          <Text style={styles.statusText}>Invite Chats -  </Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            //navigation.replace('JustInTime');
          }}>
          <Text style={styles.statusText}>Assigned Chats  - </Text>
        </MenuOption>
        <MenuOption
          onSelect={() => {
            //navigation.replace('JustInTime');
          }}>
          <Text style={styles.statusText}>Missed Chats  -  </Text>
        </MenuOption>
      </MenuOptions>
          </Menu>
        </View>
        {/* <View style={{padding:320,backgroundColor:'green'}}></View> */}
        {/* <View style={{paddingBottom:120,backgroundColor:'blue'}}></View> */}
        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0,padding:30,backgroundColor:'#0987'}}><Text>My fixed footer</Text></View>
        
        </View>
        </MenuProvider>
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
    flex:1
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
    paddingBottom: 40,
    
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
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
});

export default TestIndividualChat;