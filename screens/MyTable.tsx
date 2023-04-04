import React, {useState, useEffect} from 'react';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground,} from 'react-native';
import reserveTable from './WelcomePage'
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import { Canvas, rect, Rect,Box, SkiaView, useFont, SkFont} from '@shopify/react-native-skia';
import { Dropdown } from 'react-native-element-dropdown';



export default function MyTable() {
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
          
          Alert.alert('Scan button pressed', 'looking for tag to scan')
          
          // register for the NFC tag with NDEF in it
          await NfcManager.requestTechnology(NfcTech.Ndef);
    
          // the resolved tag object will contain `ndefMessage` property
          const tag = await NfcManager.getTag();
    
          const tagID = tag?.id
          const tagNum =  await getTagNumber(tagID)
          const tableNum = await getTableNum(tagNum)
          await updateTableStatus(tableNum)
          await putUniqueDeviceId(tagNum)
          Alert.alert(`You have reserved table ${tableNum} from scanning tag ${tagNum}`)
    
         // handleTableStatus()
    
        } catch (ex) {
          console.warn('Oops!', ex);
        } finally {
          // stop the nfc scanning
          NfcManager.cancelTechnologyRequest();
        }
      }

  //all the info for your to style is right here 
  const [courses, setCourses] = useState([]);
  const [tagNum, setTagNum] = useState(0);
  const [deviceid, setDeviceid] = useState('');
  const [tableNum, setTableNum] = useState(0);
  const [status, setStatus] =  useState('Closed')

  
  /*useEffect(() =>{
    async function displayTableCourses(){
        let response = await axios.get(`http://44.203.31.97:3001/data/api/table/courses/${tableNum}`)
        let courses = response.data
        console.warn(courses)
      }
      displayTableCourses() 

  }, []);*/
  async function displayTableCourses(){
    let response = await axios.get('http://44.203.31.97:3001')
    let courses = response.data
    console.warn(response)
  }


  useEffect(() => {
    async function checkIfUserReservedTable() {
      const uniqueId = await DeviceInfo.getUniqueId();
      let response = await axios.get(
        'http://44.203.31.97:3001/data/api/curate/specific/studytables'
      );
      const studyTables = await response.data;
      for (let i = 0; i < studyTables.length; i++) {
        if (studyTables[i].deviceid === uniqueId) {
          setCourses(studyTables[i].Courses);
          setDeviceid(studyTables[i].deviceid);
          setTableNum(studyTables[i].TableNum);
          setTagNum(studyTables[i].TagNum);
          console.warn(courses)
          break;
        }
      }
    }
    checkIfUserReservedTable();
  }, []);

  return (
    <View style={styles.container}>
       
      <View>
      <Text>Courses:</Text>
      <Text>{`${courses[0]}\n`}</Text>
      <Text>{`${courses[1]}\n`}</Text>
      <Text>See all...</Text>
       
        <Text>Tag Number: {tagNum}</Text>
        <Text>Table Number: {tableNum}</Text>
        <Text>Status: {status}</Text>
      </View>
      <TouchableOpacity onPress={reserveTable}>
              <Text  adjustsFontSizeToFit={true}>Scan a Tag</Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={reserveTable}>
              <Text  adjustsFontSizeToFit={true}>Leave Table</Text>
      </TouchableOpacity>
      <Text>Broadcast</Text>
      <Text>add a course</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // App background color
    backgroundColor: '#ecf0e4',
  },
});
