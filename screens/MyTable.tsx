import React, {useState, useEffect, SetStateAction} from 'react';
import axios from 'axios';
import DeviceInfo from 'react-native-device-info';
import {View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground} from 'react-native';
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

      async function updateSeatStatus(tagNum : number | undefined){
        await axios.put(`http://44.203.31.97:3001/data/api/bruh/${tagNum}`)
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
    
       

  //all the info for your to style is right here 
  const [coursesAtTable, setCoursesAtTable] = useState<string[]>([]);
  const [tagNum, setTagNum] = useState(0);
  const [deviceid, setDeviceid] = useState('');
  const [hasTable, setHasTable] = useState(false)
  const [tableNum, setTableNum] = useState(0);
  const [status, setStatus] =  useState('Closed to public.')
  const [showAll, setShowAll] = useState(false)
  const [studentsAtTable, setStudentsAtTable] = useState(0)
  const [courseArray,setCourseArray] = useState<courses>([])
  const [value, setValue] = useState<string | null>(null)
  const [dropDownCourseArray, setDropDownCourseArray] = useState<coursesN>([])
  const [showBroadCastModal, setShowBroadCastModal] = useState(false);
  const [coursesIamStudying, setCoursesIamStudying] = useState<string[]>([])
  const [seatsFree, setSeatsFree] = useState(0)

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


      //await handleStatus()
      await updateTableStatus(tableNum)
      await updateSeatStatus(tagNum)
      await putUniqueDeviceId(tagNum)
      
      await getNumOfStudents(tableNum)

      setHasTable(true)
      setTableNum(tableNum)
      await setEmptyCourses()

      Alert.alert(`You have secured Table ${tableNum} from scanning Tag ${tagNum}.`)

     // handleTableStatus()

    } catch (ex) {
      console.warn('Oops!', ex);
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
    }
  }   

  function openToEveryOne(){
    setStatus('Open for anyone to join.')
  }

  const toggleBroadCastModal = () =>{
    setShowBroadCastModal(!showBroadCastModal)
  }


  const renderedData = showAll ? coursesAtTable: coursesAtTable.slice(0,2)

  /*if(Object.is(coursesAtTable, []) ){
    useEffect(() =>{
      setStatus('sharing for studying')
    }, []);
  }*/

  
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

  async function getSeatsAtTable(tableNum: number | undefined){
    const response = await axios.get(`http://44.203.31.97:3001/data/api/table/numSeats/${tableNum}`)
    const numSeatsAtTable:number =  await response.data[0].count
    return numSeatsAtTable
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
          setCoursesAtTable(studyTables[i].Courses);
          setDeviceid(studyTables[i].deviceid);
          setTableNum(studyTables[i].TableNum);
          setTagNum(studyTables[i].TagNum);
          //await setEmptyCourses()
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


  async function setEmptyCourses(){
    const response = await axios.get(`http://44.203.31.97:3001/data/api/table/emptySeats/${tableNum}`)
    const emptySeats:number = await response.data[0].count
    setSeatsFree(emptySeats)
  }
  useEffect(() =>{
    async function setEmptyCourses(){
      const response = await axios.get(`http://44.203.31.97:3001/data/api/table/emptySeats/${tableNum}`)
      const emptySeats:number = await response.data[0].count
      setSeatsFree(emptySeats)
    }
    setEmptyCourses()
  }, [])

  useEffect(() =>{
    async function handleStatus(){
      if(hasTable){
      const respone =  await axios.get(`http://44.203.31.97:3001/data/api/tables/status/${tableNum}`)

      const tableStatus: boolean =  await respone.data[0].TableStatusFree
      //console.warn(tableStatus)
    
      if(tableStatus){
        setStatus('Closed to public.')
      }
      if(coursesAtTable.length> 0){
        setStatus('Open for course studying.')
      }
     }
    }
    handleStatus()
  }, [])

 
    async function addCourseToTable(){
      if(value){
        axios.put(`http://44.203.31.97:3001/data/api/bruh/tcourses/${value}/${tableNum}`)
        Alert.alert('Alert for adding a course', `The public will know that ${value} is being studied at table ${tableNum}.`)
        setCoursesAtTable([...coursesAtTable, value])
        setCoursesIamStudying([...coursesIamStudying, value])
        setStatus('Open for course studying.')
      }
    }

    async function leaveTable(){
     //logic for removing deviceid from table
      try{
         await axios.put(`http://44.203.31.97:3001/data/api/remove/deviceId/${tagNum}`)
      } catch(error){
        console.warn('Error occured after removing device id', error)
      }
      setDeviceid('')

      //logic for labeling seat as open
      try{
         await axios.put(`http://44.203.31.97:3001/data/api/seats/open/${tagNum}`)
        setStudentsAtTable(studentsAtTable -1)
      }catch(error){
        console.warn('Occured after opening seat ', error)
      }

      //logic for deleting courses that the user was studying for from the courses at table array
      for(let i = 0; i< coursesIamStudying.length; i++){
        try{
        await axios.put(`http://44.203.31.97:3001/data/api/update/Courses/${coursesIamStudying[i]}/${tableNum}`)
        }catch(error){
          console.warn('error occred while deleting course', error)
        }
        for(let j = 0; j< coursesAtTable.length;j++){
          if(coursesIamStudying[i] === coursesAtTable[j]){
            let updatedCoursesAtTable =  [...coursesAtTable]
            updatedCoursesAtTable.splice(j,1)
            setCoursesAtTable(updatedCoursesAtTable)
            break
          }
        }
      }

      //logic to lable the table as unreserved if all seats are empty at table
      const numOfSeats:number = await getSeatsAtTable(tableNum)
      let response = await axios.get(
        'http://44.203.31.97:3001/data/api/curate/specific/studytables'
      );
      const studyTables = await response.data;
      let i = 0
      let seatsEmpty: number = 0
      while(i < studyTables.length){
        if(tableNum ===  studyTables[i].TableNum  && studyTables[i].SeatStatusFree === true){
            seatsEmpty++
            if(seatsEmpty == numOfSeats){
              //handleStatus()
              try{
               axios.put(`http://44.203.31.97:3001/data/api/Tables/open/${tableNum}`)
              setCoursesAtTable([])
              }catch( error){
                console.warn('error occured when updating table to open', error)
              }
              break; 
            }
        }
        i++
      }
      setCoursesIamStudying([])
      setTagNum(0)
      setTableNum(0)
      setHasTable(false)
      Alert.alert(`You have left Table ${tableNum}.`)
    }

  return(
      <View style={styles.container}>
          {hasTable ? 
            <View style={styles.container}>
              <ImageBackground source={require('./Background.png')} style={[styles.imageBackground]}>
              <View style={styles.imageTableContainer}>
                <View style ={styles.imageTableBox}>
                  <Image source={require('./Table.png')} style={[styles.imageTable]}></Image>
                </View>
              </View>

              <View style={styles.boxContainer}>
                <TouchableOpacity style={styles.box} onPress={reserveTable}>
                  <Text style={styles.boxText} adjustsFontSizeToFit={true}>Secure Table</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.box} onPress={() => leaveTable()}>
                  <Text style={styles.boxText} adjustsFontSizeToFit={true}>Leave Table</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.courseContainer}>
                <View style={styles.titleBox}>
                  <Text style={styles.titleText} adjustsFontSizeToFit={true}>Table {tableNum} Information </Text>
                  {/*<Text>Table Number: {tableNum}</Text>*/}
                </View>

                <View style={styles.courseBoxContainer}>
                  <View style={styles.babyCourseBoxContainer}>
                    <TouchableOpacity style={styles.babyCourseBox} onPress={toggleBroadCastModal}>
                      <Text style={styles.babyBoxText} adjustsFontSizeToFit={true}>Add Course</Text>
                    </TouchableOpacity>
                    <Modal 
                      isVisible={showBroadCastModal} 
                      backdropColor='#ecf0e4' 
                      style={styles.modalBox}>
                        <Text style = {styles.listTitleText} adjustsFontSizeToFit={true}> Select the class you want to share: </Text>
                        <SelectList
                              setSelected ={(val:string | null) => setValue(val)}
                              data = {dropDownCourseArray}
                              onSelect={addCourseToTable}
                              save = "value"
                              dropdownTextStyles={{color: 'black', fontSize: 18}} 
                              inputStyles={{color: 'black', fontSize: 18}}    
                        />
                        <View style={{paddingTop: 10, width: '80%', alignSelf: 'center'}}>
                          <Button title="Close Modal" onPress={() => setShowBroadCastModal(false)}/>
                        </View>
                    </Modal>

                    <TouchableOpacity style={styles.babyCourseBox} onPress={openToEveryOne}>
                      <Text style={styles.babyBoxText} adjustsFontSizeToFit={true}>Open Table</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.listContainer}>
                  
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.listTitleText} adjustsFontSizeToFit={true}>Status: </Text>
                      <Text style={styles.listText} adjustsFontSizeToFit={true}>{status}{'\n'}</Text>
                    </View>

                    <Text style={styles.listTitleText} adjustsFontSizeToFit={true}>Courses:</Text>
                      {renderedData.map((item,index) =>(
                        <View key={index} style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, lineHeight: 24, paddingRight: 10, color: 'black'}} adjustsFontSizeToFit={true}>
                          {'\u2022'}
                        </Text>
                        <Text style={styles.listText} adjustsFontSizeToFit={true}>{item}</Text>
                        </View>
                      ))}
                      {/*
                      {!showAll && (
                        <TouchableOpacity onPress ={() => setShowAll(true)}>
                          <Text>See All...</Text>
                        </TouchableOpacity>
                      )}
                      */}
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.listTitleText} adjustsFontSizeToFit={true}>{'\n'}Study Buddies: </Text>
                      <Text style={styles.listText} adjustsFontSizeToFit={true}>{'\n'}{studentsAtTable}{'\n'}</Text>
                    </View>

                    {/*<Text>Seats Occupied: {studentsAtTable}</Text>*/}
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.listTitleText} adjustsFontSizeToFit={true}>Seats Available: </Text>
                      <Text style={styles.listText} adjustsFontSizeToFit={true}>{seatsFree}{'\n'}</Text>
                    </View>
                  </View>
                </View>
              </View>
            
            </ImageBackground>
          </View> : 
          <View style={styles.container}>
            <ImageBackground source={require('./Background.png')} style={[styles.imageBackground]}>
              <View style={styles.noTableContainer}>
                <View style={styles.noTableBox}>
                  <Text style={styles.noTableText} adjustsFontSizeToFit={true}>You have not secured a table yet.{'\n'}Tap the button below to secure a table.</Text>
                </View>
              </View>

              <View style={styles.boxContainer}>
              <TouchableOpacity style={styles.boxNoTable} onPress={reserveTable}>
                <Text style={styles.boxText} adjustsFontSizeToFit={true}>Secure Table</Text>
              </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>}
            
            {/*<View style={styles.boxContainer}>
              <TouchableOpacity style={styles.box} onPress={reserveTable}>
                <Text style={styles.boxText} adjustsFontSizeToFit={true}>Secure Table</Text>
              </TouchableOpacity>
            </View>
            */}
    </View>
  );
 }

const styles = StyleSheet.create({
 container:{
    flex: 1, // sets the entire screen size to 1
    backgroundColor: '#ecf0e4',
  },
  imageBackground:{
    flex: 1,
    resizeMode: 'cover',
  },
  imageTableContainer: {
    flex: 1.5,
    //backgroundColor: 'yellow'
  },
  imageTableBox: {
    flex: 1,
    borderRadius: 10,
    //maxHeight: '50%',
    width: '50%',
    padding: '3%',
    marginTop: '5%',
    alignSelf: 'center',
    backgroundColor: '#fbe29c',
    z: 0
  },
  imageTable: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
  },
  courseContainer: {
    flex: 5,
    justifyContent: 'center',
    //backgroundColor: 'black'
  },
  titleBox: {
    flex: 1,
    borderRadius: 10,
    padding: '3%',
    backgroundColor: '#5488a5',
    width: '90%',
    height: '95%',
    alignSelf: 'center'
  },
  titleText: {
    fontSize: 20,
    color: 'white',
  },
  courseBoxContainer: {
    flex: 15,
    borderRadius: 10,
    backgroundColor: '#bedeff',
    padding: '3%',
    width: '90%',
    height: '95%',
    marginBottom: '3%',
    alignSelf: 'center'
  },
  babyCourseBoxContainer:{
    flex: 1,
    flexDirection: 'row', // sets the child elements to be horizontal
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    //backgroundColor: 'pink'
  },
  babyCourseBox: {
    flex: 1, 
    padding: '3%',
    //maxHeight: '25%',
    maxWidth: '45%',
    borderRadius: 10,
    backgroundColor: '#fbe29c',
  },
  babyBoxText: {
    flex: 1,
    fontSize: 18, 
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  listContainer:{
    flex: 6,
    padding: '3%'
    //backgroundColor: 'yellow'
  },
  listTitleText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold'
  },
  listText: {
    fontSize: 18,
    //fontWeight: '500',
    color: 'black',
  },
  modalBox: {
    flex: 1,
    alignSelf: 'center',
    marginTop: '50%',
    marginBottom: '50%',
    opacity: 1,
    backgroundColor: '#bedeff',
    padding: '3%',
    alignContent: 'center',
    borderRadius: 10
  },
  noTableContainer: {
    flex: 0.15,
    //backgroundColor:'red'
  },
  noTableBox: {
    flex: 1,
    padding: '3%',
    marginTop: '5%',
    //maxHeight: '25%',
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#bedeff'
  },
  noTableText:{
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: 'black',
    fontSize: 20
  },
  box: {
    flex: 1, 
    padding: '3%',
    margin: '5%',
    maxWidth: '50%',
    borderRadius: 10,
    backgroundColor: '#86cba6',
  },
  boxContainer: {
    flex: 1,
    flexDirection: 'row', // sets the child elements to be horizontal
    alignItems: 'flex-start',
    justifyContent: 'center',
    //backgroundColor: "pink" this is test
  },
  boxNoTable:{
    flex: 1, 
    padding: '3%',
    margin: '5%',
    maxHeight: '10%',
    maxWidth: '50%',
    borderRadius: 10,
    backgroundColor: '#86cba6',
  },
  boxText:{
    flex: 1,
    fontSize: 18, 
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
});
