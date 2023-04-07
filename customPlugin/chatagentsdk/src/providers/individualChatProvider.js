import React, {createContext, useContext, useEffect, useState} from 'react';


import IndividualChat from '../screens/IndividualChat';
import {SafeAreaView, Text } from 'react-native';
import {useRoute} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import MyContext from '../components/globalcontext';


const Stack = createStackNavigator();

export const ChatMessageScreen = (route) => {
 

 

  const route1=useRoute();
  console.log("Route1",JSON.stringify(route1));
  // let[chat,setChat]=useState(route1.params.item);
  console.log(chat);
//   const [chat, setChat] = useState(chat);
  const[users,SetUsers]=useState();
  const[newMessages,setNewMessages]=useState();
  

 

  if (!chat) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
          alignItems: 'center',
        }}>
        <Text>Loading data...</Text>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <MyContext.Provider value={chat}>
        <IndividualChat value={route1.params.item} /> 
        </MyContext.Provider>

      </SafeAreaView>
    );
  }
  
};


