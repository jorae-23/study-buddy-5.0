import React, {useState, useCallback, useEffect}from 'react';
import {View, Text as RNText, Button, TouchableOpacity, StyleSheet, Image, ImageBackground, ScrollView} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import { Canvas, rect, Rect, Box, SkiaView, Text as SkiaText, useFont, SkFont, FontWeight} from '@shopify/react-native-skia';
import { SelectList } from 'react-native-dropdown-select-list';
import  Modal  from 'react-native-modal';
import LibFloorPlan from './LibFloorPlan';

NfcManager.start();

interface courseDesc{
    CourseCode: string,
    CourseName: string,
}
interface courseDescN{
  key: string,
  value: string
}

interface StudyTable{
    Courses: string[],
    TagNum: number,
    TableNum:number,
    SeatStatusFree: boolean,
    TableStatusFree: boolean
}

type studytable = StudyTable[]

type courses = courseDesc[]
type coursesN = courseDescN[]

export default function SearchCourse(){
  const visualTableMap = new Map()
  //const font = useFont(require('../assets/fonts/OpenSans-Regular.ttf'), 15)

  visualTableMap.set(1,<Box box={rect(20,350,50,50)}></Box>)
  visualTableMap.set(8,<Box box={rect(100,350,50,50)}></Box>)
  visualTableMap.set(7,<Box box={rect(180,350,50,50)}></Box>)
  
    const [value, setValue] = useState<string | undefined>()
    const [myTableFilterArray, setMyTableFilterArray] = useState<React.ReactNode[]>([]);
    const [courseArray,setCourseArray] = useState<courses>([])
    const [dropDownCourseArray, setDropDownCourseArray] = useState<coursesN>([])
    const [tableArray, setTableArray] = useState<any[]>([])
    const [showFloorModal, setShowFloorModal] = useState(false);

    let studytables: studytable = []
    
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

    
    async function studyTablesInfo() {
      setMyTableFilterArray([])
        setTableArray([])
        let response2 = await axios.get(
          `http://44.203.31.97:3001/data/api/curate/specific/studytables`
        );
        studytables = await response2.data;
        let tempArray= []
        //let newTableFilterArray: React.ReactNode[] = [];
        for (let i = 0; i < studytables.length; i++) {
          for (let j = 0; j < studytables[i].Courses.length; j++) {
            let currentCourse = studytables[i].Courses[j];
            if (currentCourse === value && currentCourse !== null) {
              const response = await axios.get(`http://44.203.31.97:3001/data/api/table/emptySeats/${studytables[i].TableNum}`)
              const emptySeats:number = await response.data[0].count
              
              let obj ={
                floorLevel: 1,
                tableNum: studytables[i].TableNum,
                openSeats: emptySeats
              }
              tempArray.push(obj)
            }
          }
        }
        let uniqueTempArray = tempArray.filter((obj, index, self) =>
        index === self.findIndex((t) => (
          t.floorLevel === obj.floorLevel && t.tableNum === obj.tableNum && t.openSeats === obj.openSeats
        ))
      );
        setTableArray(uniqueTempArray)
    } 
      
    return(
        <View style={styles.container}>
          <ImageBackground source={require('./Background.png')} style={[styles.imageBackground]}>
            <View style={styles.introTextContainer}>
                <View style={styles.introBox}>
                  <RNText style={styles.introText} adjustsFontSizeToFit={true}>Select a course you would like to study:</RNText> 
                </View>
            </View>

            <View style={styles.dropdownContainer}>
              <SelectList
                  setSelected ={(val:string) => setValue(val)}
                  onSelect={studyTablesInfo}
                  data = {dropDownCourseArray}
                  save = "value"
                  searchPlaceholder='Search'
                  boxStyles={styles.boxStyle}
                  inputStyles={styles.inputStyle}
                  dropdownStyles={styles.dropdownStyle}
                  dropdownTextStyles={styles.dropDownTextStyle} 
              />
            </View>

            <View style={styles.imageContainer}>
              <Image source={require('./Courses.png')} style={[styles.image]}></Image>
            </View>
            <View style={styles.courseContainer}>
              <View style={styles.titleBox}>
                <RNText style={styles.titleText}>Course Description</RNText>
              </View>
              <View style={styles.courseBox}>
                  <RNText style={styles.courseText} adjustsFontSizeToFit={true}>{value}</RNText>
                  <RNText></RNText>
                  <RNText style={styles.courseText} adjustsFontSizeToFit={true}> Locations </RNText>
                  <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    {tableArray.map((table) => (
                    <View key={`${table.floorLevel}-${table.tableNum}`}>
                      <RNText style={styles.locationText} adjustsFontSizeToFit={true}>    Floor Level: {table.floorLevel}</RNText>
                      <RNText style={styles.locationText} adjustsFontSizeToFit={true}>    Table Number: {table.tableNum}</RNText>
                      <RNText style={styles.locationText} adjustsFontSizeToFit={true}>    Open Seats: {table.openSeats}</RNText>
                      <RNText style={styles.locationText} adjustsFontSizeToFit={true}></RNText>
                    </View>))} 
                  </ScrollView>
              </View>
              <TouchableOpacity onPress={() => setShowFloorModal(true)}>
                      <RNText adjustsFontSizeToFit={true}>Show Floor Plan</RNText>
              </TouchableOpacity>
              <View>
              <Modal 
                isVisible={showFloorModal} 
                backdropColor='#ecf0e4' 
              >
                <LibFloorPlan selectedCourse={value}/>
                <Button title="Close Modal" onPress={() => setShowFloorModal(false)} />
              </Modal>
              </View>
            </View>
          </ImageBackground>  
        </View>   
    )
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
  introTextContainer: {
    flex: 1,
    justifyContent: 'center',
    //backgroundColor: 'white'
  },
  introBox: {
    alignSelf: 'center',
    padding: '1%',
    height: '80%',
    width: '90%',
    marginTop: '3%',
    borderRadius: 10,
    backgroundColor: '#86cba6',
    alignItems: 'center',
    justifyContent: 'center'
  },
  introText: {
    color: 'black',
    fontSize: 20
  },
  dropdownContainer: {
    //backgroundColor: 'red'
  },
  boxStyle: {
    borderRadius: 10,
    backgroundColor: '#fbe29c',
    margin: '2%',
    width: '80%',
    alignSelf: 'center',
    borderWidth: 0
  },
  inputStyle: {
    color: 'black',
    fontSize: 15
  },
  dropdownStyle: {
    backgroundColor: '#fbe29c',
    width: '80%',
    alignSelf: 'center',
  },
  dropDownTextStyle: {
    color: 'black',
    fontSize: 15
  },
  imageContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'pink'
  },
  image: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  courseContainer: {
    flex: 7,
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
    fontSize: 16.5,
    color: 'white',
  },
  courseBox: {
    flex: 15,
    borderRadius: 10,
    backgroundColor: '#bedeff',
    padding: '3%',
    width: '90%',
    height: '95%',
    marginBottom: '3%',
    alignSelf: 'center'
  },
  courseText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  locationText: {
    fontSize: 15,
    color:'black'
  }
});

/*
<Canvas style={{width: 400, height: 400}}>
                {myTableFilterArray}
</Canvas>
*/