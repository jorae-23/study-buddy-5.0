import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground, Platform, UIManager} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import { useNavigation } from '@react-navigation/native';

import {AccordionList} from 'react-native-accordion-list-view';
import Icon from 'react-native-vector-icons/Ionicons';

NfcManager.start();

export default function WelcomePage(){
  const navigation = useNavigation();

  function navigateToMyTable() {
    navigation.navigate('My Table' as never);
  }

  function navigateToSearchCourse() {
    navigation.navigate('Search Course' as never);
  }

  function navigateToLibFloorPlan() {
    navigation.navigate('Library Floor Plan'as never);
  }

  // Stuff for the drop down of sections
  const sections = [
    { title: 'About Us',
      content: 'Explanation of the company',
    },
    { title: 'My Table Page',
      content: 'Explanation of the page',
    },
    { title: 'Search Course Page',
      content: 'Explanation of the page',
    },
    { title: 'Library Layout Page',
      content: 'Explanation of the page',
    }
  ];
  
  /*
  useEffect(() => {
    if (Platform.OS === 'android') {
        if (UIManager.setLayoutAnimationEnabledExperimental) {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }
    }
  }, []);
  */
  

  const [status, setTableStatus] =  useState('#86cba6')

  const handleTableStatus = () =>{
    //if the table is empty and somebody new comes to reserve it must be turned to red
    //we also must update the status of the masterUser at that tag to be True

    //if is already reserved as red from the master user scanning, and they want to open the
    //table to simply anybody, the table will turn Yellow with the words open to anybody.
    //only the master user can do this intially which is a restriction.

    //if it is already reserved as red from the master user scanning and they want to open 
    //the table to specific classes, the table will turn yellow with the class array below
    //to signify which classes are being studied here according the master user.
    //Please note that this option is open to both the master user and intially
    //and anybody else who's at the table itself after the master user has selected that they've open the table. 

    const newStatus = status === '#86cba6' ? '#fbe29c' : '#86cba6'
    setTableStatus(newStatus)
  }

  async function getTagNumber(tagId : String | undefined){
    let tagNum
    try {
        const response = await axios.get(`http://44.203.31.97:3001/data/api/${tagId}`)
        tagNum = response.data[0].TagNum
    } catch(error) {
        console.warn('something went wrong getting the tag number', error)
    }
    return tagNum
  }

  async function getTableNum(tagNum : number | undefined){
    let tableNum
    try {
        const response = await axios.get(`http://44.203.31.97:3001/data/api/g/${tagNum}`)
        tableNum = response.data[0].TableNum
    } catch(error) {
        console.warn('something went wrong getting the table numbers', error)
    }
    return tableNum
  }

  async function updateTableStatus(tableNum : number | undefined){
    await axios.put(`http://44.203.31.97:3001/data/api/g/c/${tableNum}`)
  }

  async function putUniqueDeviceId(tagNum: number | undefined){
    const uniqueId =  await DeviceInfo.getUniqueId()
    await axios.put(`http://44.203.31.97:3001/practi/${uniqueId}/${tagNum}`)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.error(error)
      })
}

  async function reserveTable() {
    try {
      Alert.alert('Secure table button selected.', 'Looking for tag to scan.')
      
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      const tagID = tag?.id
      const tagNum =  await getTagNumber(tagID)
      const tableNum = await getTableNum(tagNum)
      await updateTableStatus(tableNum)
      await putUniqueDeviceId(tagNum)
      Alert.alert(`You have reserved Table ${tableNum} from scanning Tag ${tagNum}.`)

      handleTableStatus()

    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styless.container}>
        <ImageBackground source={require('./Background.png')} style={[styless.imageBackground]}>
          
          <View style={styless.boxContainer}>
            <TouchableOpacity style={styless.box} onPress={reserveTable}>
              <Text style={styless.boxText}>Secure Table</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styless.box} onPress={reserveTable}>
              <Text style={styless.boxText}>Leave Table</Text>
            </TouchableOpacity>
          </View>

          <View style={styless.middleContainer}>
            <View style={styless.logoContainer}>
              <Image source={require('./BLogo.png')} style={styless.image}></Image>
            </View>

            <View style={styless.welcomeContainer}> 
              <Text style={styless.welcomeText} adjustsFontSizeToFit={true}> WELCOME! </Text>
              <View style={styless.welcomeLine}></View>
              <View style={styless.welcomeBox}>
                <AccordionList
                        data={sections}
                        containerItemStyle = {styless.dropBox}
                        customTitle={item => <Text style={styless.dropBoxText}>{item.title}</Text> }
                        customBody={item => <Text style={styless.dropBoxText}>{item.content}</Text>}
                        animationDuration={300}
                        expandMultiple={false}
                />
              </View>
            </View>
          </View>

          <View style={styless.navContainer}>
            <TouchableOpacity style={styless.box} onPress={navigateToMyTable}>
              <Text style={styless.boxText}>My Table</Text>
            </TouchableOpacity>
  
            <TouchableOpacity style={styless.box} onPress={navigateToSearchCourse}>
              <Text style={styless.boxText}>Search Course</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styless.box} onPress={navigateToLibFloorPlan}>
              <Text style={styless.boxText}>Library Layout</Text>
            </TouchableOpacity>
          </View>

        </ImageBackground>
    </View> 
  );
};
const styless = StyleSheet.create({
    container: {
      // App background color
      //backgroundColor: '#ecf0e4',
      flex: 1, // sets the entire screen size to 1
      flexDirection: 'column',
      justifyContent: 'center'
    },
    imageBackground:{
      flex: 1,
      resizeMode: 'cover'
    },
    boxContainer: {
      flex: 1,
      flexDirection: 'row', // sets the child elements to be horizontal
      alignItems: 'center',
      justifyContent: 'flex-start'
      //backgroundColor: '#FFC107'
    },
    box:{
      flex: 1, 
      padding: '3%',
      marginHorizontal: '3%',
      height: '70%',
      width: '100%',
      borderRadius: 10,
      backgroundColor: '#86cba6',
      justifyContent: 'center'
    },
    boxText:{
      fontSize: 18, 
      color: 'black',
      textAlign: 'center'
    },
    middleContainer: {
      flex: 5.5,
      alignContent: 'center',
      //backgroundColor: '#00BCD4'
    },
    logoContainer: {
      flex: 1,
      //flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      flex: 1,
      resizeMode: 'contain',
      padding: '5%',
      width: '50%'
    },
    welcomeContainer: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'flex-start',
      //backgroundColor: '#FF5252',
    },
    welcomeText: {
      fontSize: 35, 
      color: 'black',
      textAlign: 'center'
    },
    welcomeLine: {
      width: '80%',
      height: '1.5%',
      borderRadius: 10,
      backgroundColor: '#000000'
    },
    welcomeBox: {
      flex: 1, 
      padding: '3%',
      marginVertical: '2%',
      width: '90%',
      borderRadius: 10,
      backgroundColor: '#5488a5'
    },
    welcomeBoxText: {
      fontSize: 18, 
      color: 'black',
      textAlign: 'center'
    },
    dropBox: { 
      backgroundColor: '#fbe29c',
      padding: '3%',
      marginBottom: '3%'
    },
    dropBoxText: {
      fontSize: 18, 
      color: 'black',
      textAlign: 'left'
    },
    navContainer: {
      flex: 1,
      flexDirection: 'row', // sets the child elements to be horizontal
      alignItems: 'center',
      justifyContent: 'flex-start'
      //backgroundColor: '#FF1493'
    }
  });

