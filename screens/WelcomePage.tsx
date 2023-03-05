import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';

NfcManager.start();
export default function WelcomePage(){
  const [status, setTableStatus] =  useState('green')

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


    const newStatus = status === 'green' ? 'red' : 'green'
    setTableStatus(newStatus)
  }

  async function getTagNumber(tagId : String | undefined){
    let tagNum
    try {
        const response = await axios.get(`http://10.20.45.60:3001/data/api/${tagId}`)
        tagNum = response.data[0].TagNum
    } catch(error) {
        console.warn('something went wrong getting the tag number', error)
    }
    return tagNum
  }

  async function getTableNum(tagNum : number | undefined){
    let tableNum
    try {
        const response = await axios.get(`http://10.20.45.60:3001/data/api/g/${tagNum}`)
        tableNum = response.data[0].TableNum
    } catch(error) {
        console.warn('something went wrong getting the table number', error)
    }
    return tableNum
  }

  async function updateTableStatus(tableNum : number | undefined){
    await axios.put(`http://10.20.45.60:3001/data/api/g/c/${tableNum}`)
  }

  async function reserveTable() {
    try {
      Alert.alert('Scan button pressed', 'looking for tag to scan')
      
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();

      const tagID = tag?.id
      const tagNum =  await getTagNumber(tagID)
      const tableNum = await getTableNum(tagNum)
      await updateTableStatus(tableNum)
      Alert.alert(`You have reserved table ${tableNum} from scanning tag ${tagNum}`)

      handleTableStatus()

    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styless.wrapper}>
        <TouchableOpacity onPress={reserveTable}>
          <Text>Scan a Tag!</Text>
        </TouchableOpacity>
        <View style ={[styless.header, {backgroundColor: status}]}>
          <Text>Table 7</Text>
        </View>
        
    </View>
  );
}
const styless = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    header:{
      padding: 20,
      backgroundColor: '#f0ffff',
      borderWidth: 1,
      borderColor: ''
    },
    boldText:{
      fontWeight: 'bold'
    }
  });