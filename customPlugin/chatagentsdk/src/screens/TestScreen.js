import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Tab, Text, TabView } from '@rneui/themed';

import {
	Menu,
	MenuOptions,
	MenuOption,
	MenuTrigger,
	MenuProvider
   } from 'react-native-popup-menu';
const MenuExample = () => {
const [visible, setVisible] = useState(false);
const [index, setIndex] = React.useState(0);


return (
	<>
	<View style={{flex:1}}>
    <Tab
      value={index}
      onChange={(e) => setIndex(e)}
      indicatorStyle={{
        backgroundColor: 'white',
        height: 3,
      }}
      variant="primary"
    >
      <Tab.Item
        title="Recent"
        titleStyle={{ fontSize: 12 }}
        icon={{ name: 'timer', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="favorite"
        titleStyle={{ fontSize: 12 }}
        icon={{ name: 'heart', type: 'ionicon', color: 'white' }}
      />
      <Tab.Item
        title="cart"
        titleStyle={{ fontSize: 12 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
	  <Tab.Item
        title="cart"
        titleStyle={{ fontSize: 12 }}
        icon={{ name: 'cart', type: 'ionicon', color: 'white' }}
      />
    </Tab>

    <TabView value={index} onChange={setIndex} animationType="spring">
      <TabView.Item style={{ backgroundColor: 'red', width: '100%' }}>
        <Text h1>Recent</Text>
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: 'blue', width: '100%' }}>
        <Text h1>Favorite</Text>
      </TabView.Item>
      <TabView.Item style={{ backgroundColor: 'green', width: '100%' }}>
        <Text h1>Cart</Text>
      </TabView.Item>
    </TabView>
	<TabView.Item>
	<View style={{padding:10,backgroundColor:'red',flex:3,position:'relative',}}>
	<MenuProvider>
	
	<Menu>
  <MenuTrigger text='Select action' />
  <MenuOptions>
	<MenuOption onSelect={() => alert(`Save`)} text='Save' />
	<MenuOption onSelect={() => alert(`Delete`)} >
	  <Text style={{color: 'red'}}>Delete</Text>
	</MenuOption>
	<MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Disabled' />
  </MenuOptions>
</Menu>
	
	</MenuProvider>
	</View>
	</TabView.Item>
	</View>
	
  </>

);
};

export default MenuExample;

const styles = StyleSheet.create({
container: {
	padding: 50,
	flexDirection: 'row',
	justifyContent: 'center',
	height: 200,
},
});

