import React, {useState} from 'react';
import { useEffect } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,Image} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import {getChannelList} from '../services/api';
import {useNavigation, StackActions} from '@react-navigation/native';
import {getTemplateList} from '../services/api';
import { sendTemplateApi } from '../services/api';

const JustInTime = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [channelValue, setChannelValue] = useState({});
  const [templateValue, setTemplateValue] = useState({});
  const[broadcastList,setBroadcastList]=useState([]);
  const[channelList,setChannelList]=useState([]);
  const[templateList,setTemplateList]=useState([]);
  const data = [
    { label: 'Item 1', value: '1' },
    { label: 'Item 2', value: '2' },
    { label: 'Item 3', value: '3' },
    { label: 'Item 4', value: '4' },
    { label: 'Item 5', value: '5' },
    { label: 'Item 6', value: '6' },
    { label: 'Item 7', value: '7' },
    { label: 'Item 8', value: '8' },
  ];
  const [mobileNumbers, onChangeMobileNumbers] = React.useState('');
  const [number, onChangeNumber] = React.useState('');
  const navigation = useNavigation();
  useEffect(()=>{
    setModalVisible(false)
    getChannelList().then(data => {
        console.log('data-->', data);
       // setBroadcastList(data);
        setChannelList(data);
  })
  .catch(error => console.error('Error:', error));
},[]);

  return (
    <ScrollView><View style={styles.header}>
      <Text style={styles.headerTitle}>BroadCast</Text>
    </View>
    <View style={{ flex: 2,padding:10}}>
        <Text style={styles.headerText}>Choose Channel</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={channelList}
          search
          maxHeight={300}
          labelField="name"
          valueField="_id['$oid']"
          placeholder="Select Channel"
          searchPlaceholder="Search..."
          value={channelValue}
          onChange={item => {
            var channelId=item['_id']['$oid'];
            
            setChannelValue(item['_id']['$oid']);

            
            getTemplateList(channelId).then(data => {
              console.log('template-data-->', data);
              // setBroadcastList(data);
              setTemplateList(data);
            })
              .catch(error => console.error('Error:', error));


          } } />
        <Text style={styles.headerText}>Choose Template</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={templateList}
          search
          maxHeight={300}
          labelField="name"
          valueField="templateId"
          placeholder="Select Template"
          searchPlaceholder="Search..."
          value={templateValue}
          onChange={item => {
            var a={};
            a['name']=item['name'];
            a['templateId']=item['templateId']
            setTemplateValue(a);
           

          } } />
        <Text style={styles.headerText}>Mobile Numbers</Text>
        <View>
          <TextInput
            style={styles.inputText}
            onChangeText={onChangeMobileNumbers}
            value={mobileNumbers}
            placeholder="Enter mobile numbers with comma" />
        </View>



        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            } }>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{channelValue}</Text>
                <Text style={styles.modalText}>{templateValue}</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}>
                  <Text style={styles.textStyle}>Hide Preview</Text>
                </Pressable>
              </View>
            </View>
          </Modal>

          {/* <Pressable
        style={[styles.prevButton, styles.buttonOpen,{paddingBottom:10}]}
        onPress={() => {
          console.log("MobilkeNumbers",mobileNumbers);
          setModalVisible(true)}}>
        <Text style={styles.textStyle}>Show Preview</Text>
    </Pressable> */}
  

          <Pressable
            style={[styles.button, styles.buttonOpen]}
            onPress={() => {
              console.log("MobilkeNumbers", mobileNumbers);
             var mobileArray= mobileNumbers.split(',');
             console.log("MobilkeNumbers", mobileArray);
             var a={};
             a['channelValue']=channelValue;
             a['templateValue']=templateValue;
             a['mobileNumbers']=mobileArray;
             console.log("SelectedValues", JSON.stringify(a));
             sendTemplateApi(a).then(data=>{
              console.log("res data",JSON.stringify(data));
             // navigation.navigate("ChatListPage")
             onChangeMobileNumbers('');
             setTemplateValue({});

              Alert.alert(data.message);
             })
             

              //setModalVisible(true)
            } }>
            <Text style={styles.textStyle}>Send templates</Text>
          </Pressable>
        </View>
      </View>
      <View style={{flex:2,paddingTop:10,padding:10}}>
      <Text style={styles.headerText}>Show Preview</Text>
      <View style= 
    {{height:600,width:300,backgroundColor:'pink',borderRadius:20,margin:10}}> 
    {/* <Image style= {styles.bgImage} source={require('../../assets/bg.png') } ></Image> */}
  </View>
      </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#00BFFF',
  },
  headerTitle: {
    fontSize: 30,
    color: '#FFFFFF',
    marginTop: 10,
    
  },
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
   
    marginTop: 22,
  },
  headerText:{
    fontSize:20,
    fontStyle:'normal',
    color:'blackr'
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
  prevButton: {
    borderRadius: 20,
    padding: 10,
    
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#F194FF',
    
  },
buttonOpen: {
    backgroundColor: '#00BFFF',
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
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  inputText: {
    height: 80,
    margin: 5,
    borderWidth: 2,
    padding: 10,
    borderColor:'gray',
    borderRadius:15
  },
  bgImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
},
});



export default JustInTime;