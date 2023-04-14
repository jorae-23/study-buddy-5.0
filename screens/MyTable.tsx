import React, {useState, useEffect, SetStateAction} from 'react';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground} from 'react-native';
import reserveTable from './WelcomePage'
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert , Button} from 'react-native';
import { Canvas, rect, Rect,Box, SkiaView, useFont, SkFont} from '@shopify/react-native-skia';
import { Dropdown } from 'react-native-element-dropdown';
import  Modal  from 'react-native-modal';
import { SelectList } from 'react-native-dropdown-select-list';

interface courseDesc{
  CourseCode: string,
  CourseName: string,
}

interface courseDescN{
  key: string,
  value: string
}
type courses = courseDesc[]

type coursesN = courseDescN[]



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
  const [courses, setCourses] = useState<string[]>([]);
  const [tagNum, setTagNum] = useState(0);
  const [deviceid, setDeviceid] = useState('');
  const [hasTable, setHasTable] = useState(false)
  const [tableNum, setTableNum] = useState(0);
  const [status, setStatus] =  useState('Closed')
  const [showAll, setShowAll] = useState(false)
  const [studentsAtTable, setStudentsAtTable] = useState(0)
  const [courseArray,setCourseArray] = useState<courses>([])
  const [value, setValue] = useState<string | null>(null)
  const [dropDownCourseArray, setDropDownCourseArray] = useState<coursesN>([])

  const [showBroadCastModal, setShowBroadCastModal] = useState(false);

  

  const toggleBroadCastModal = () =>{
    setShowBroadCastModal(!showBroadCastModal)
  }


  const renderedData = showAll ? courses: courses.slice(0,2)

  if(!Object.is(courses, [])){
    useEffect(() =>{
      setStatus('sharing')
    }, []);
  }

  
  /*useEffect(() =>{
    async function displayTableCourses(){
        let response = await axios.get(`http://44.203.31.97:3001/data/api/table/courses/${tableNum}`)
        let courses = response.data
        console.warn(courses)
      }
      displayTableCourses() 

  }, []);*/
  
  async function getNumOfStudents(tableNum: number | undefined){
    const response = await axios.get(`http://44.203.31.97:3001/data/api/g/totalStudents/${tableNum}`)
    const numOStu:number =  await response.data[0].num_occupied_seats
    setStudentsAtTable(numOStu)
  }

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
        await getNumOfStudents(studyTables[i].TableNum)
        break;
      }
    }
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
          setHasTable(true)
          await getNumOfStudents(studyTables[i].TableNum)
          break;
        }
        setHasTable(false)
      }
    }
    checkIfUserReservedTable()
    //console.warn("tableNum at this point after the checkIfUserReserved is: " , tableNum)
  }, []);

  useEffect(() => {
    async function loadCourses() {
      const response = await axios.get(`http://44.203.31.97:3001/`);
      const courses = response.data as courses;
      setCourseArray(courses);
    }
    loadCourses();
    //console.warn(courseArray)
  }, []);

  useEffect(() => {
    async function fillDropCourseArray(){
      let newDropDownCourseArray: coursesN = [];
      for(let i = 0; i< courseArray.length; i++){
        let courseCode = courseArray[i].CourseCode
        let courseName = courseArray[i].CourseName
        let obj = {
          key: courseCode,
          value: courseName,
        }
        newDropDownCourseArray.push(obj);
      }
      setDropDownCourseArray(newDropDownCourseArray);
    }
    fillDropCourseArray()
  }, [courseArray]);

 
    async function addCourseToTable(){
      if(value){
        axios.put(`http://44.203.31.97:3001/data/api/bruh/tcourses/${value}/${tableNum}`)
        Alert.alert('alert for adding a course', `the public knows that ${value} is being studied at table ${tableNum}`)
        setCourses([...courses, value])
      }
    }
   
  /*
  useEffect(() =>{
    async function getNumOfStudents(tableNum: number | undefined){
      const response = await axios.get(`http://44.203.31.97:3001/data/api/g/totalStudents/${tableNum}`)
      const numOStu:number =  await response.data[0].num_occupied_seats
      console.warn(numOStu)
      setStudentsAtTable(numOStu)
    }
    getNumOfStudents(tableNum);

  }, []) */

  return(
    <View>
     {hasTable ? 
    <View style={styles.container}>
      
      <Text>Table Number: {tableNum}</Text>
      <TouchableOpacity onPress={reserveTable}>
              <Text  adjustsFontSizeToFit={true}>Scan a Tag</Text>
      </TouchableOpacity>
        <Text style = {{color: 'black'}}>My table</Text>

        <TouchableOpacity onPress={toggleBroadCastModal}>
          <Text style = {{color: 'black'}}>Broad Cast</Text>
        </TouchableOpacity>

        <Modal isVisible={showBroadCastModal} backdropColor='white'>
          <Text>Select the class you want to share to </Text>
          <SelectList
                 setSelected ={(val:string | null) => setValue(val)}
                 data = {dropDownCourseArray}
                 onSelect={addCourseToTable}
                 save = "value"
           />
          <Button title="Close Modal" onPress={() => setShowBroadCastModal(false)} />
        </Modal>

        {/*
        <Canvas style={{width: 500, height: 500}}>
            <Box box={rect(115,350,150,150)}></Box>
  </Canvas> */}
      
    
      <TouchableOpacity  onPress={reserveTable}>
              <Text  adjustsFontSizeToFit={true}>Leave Table</Text>
      </TouchableOpacity>
      <View>
        <Text>Status: {status}</Text>
        <Text>Courses:</Text>
        {renderedData.map((item,index) =>(
          <Text key ={index}>{item}</Text>
        ))
        }
        {!showAll && (
          <TouchableOpacity onPress ={() => setShowAll(true)}>
            <Text>See All...</Text>
          </TouchableOpacity>
        )}
        <Text>Study Buddies: {studentsAtTable}</Text>
      </View>
      <Text>Seats Occupied: {studentsAtTable}</Text>
      <Text>Seats Available: {}</Text>
 
    </View> : <View><Text>You have not reserved a table yet</Text></View>}
  </View>
  );
 }

const styles = StyleSheet.create({
  container: {
    // App background color
    backgroundColor: '#ecf0e4',
  },
});
