import React, {useState, useCallback, useEffect}from 'react';
import {View, Text as RNText ,TouchableOpacity, StyleSheet, Button} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { Canvas, rect, Rect,Box, SkiaView,Text as SkiaText, useFont, SkFont} from '@shopify/react-native-skia';

interface courseDesc{
    CourseCode: string,
    CourseName: string,
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

export default function SearchCourse(){
  const visualTableMap = new Map()
  //const font = useFont(require('../assets/fonts/OpenSans-Regular.ttf'), 15)

  visualTableMap.set(1,<Box box={rect(20,350,50,50)}></Box>)
  visualTableMap.set(8,<Box box={rect(100,350,50,50)}></Box>)
  visualTableMap.set(7,<Box box={rect(180,350,50,50)}></Box>)

 /* if(font){
      visualTableMap.set(1,<SkiaText
          x={20}
          y={350}
          text="Table 1"
          font={font}
        /> ) 
        visualTableMap.set(8,<SkiaText
          x={100}
          y={350}
          text="Table 8"
          font={font}
        />  
         ) 
        visualTableMap.set(7, <SkiaText
          x={180}
          y={350}
          text="Table 7"
          font={font}
        />)  
    } */
    const [value, setValue] = useState<string | null>(null)
    const [myTableFilterArray, setMyTableFilterArray] = useState<React.ReactNode[]>([]);
    const [courseArray,setCourseArray] = useState<courses>([])

    let studytables: studytable = []
    
    useEffect(() => {
      async function loadCourses() {
        const response = await axios.get(`http://44.203.31.97:3001/`);
        const courses = response.data as courses;
        setCourseArray(courses);
      }
      loadCourses();
    }, []);

    async function studyTablesInfo() {
        setMyTableFilterArray([])
        let response2 = await axios.get(
          `http://44.203.31.97:3001/data/api/curate/specific/studytables`
        );
        studytables = await response2.data;
        let newTableFilterArray: React.ReactNode[] = [];
        for (let i = 0; i < studytables.length; i++) {
          for (let j = 0; j < studytables[i].Courses.length; j++) {
            let currentCourse = studytables[i].Courses[j];
            if (currentCourse === value && currentCourse !== null) {
              visualTableMap.forEach((tableNum, table) => {
                if(table === studytables[i].TableNum){
                    console.warn(table)
                    newTableFilterArray.push(tableNum);
                }
              });              
            }
          }
        }
        setMyTableFilterArray(newTableFilterArray);
      } 
      

    const renderLabel = () =>{ 
            return(
                <RNText>
                    Courses
                </RNText>
            )
    }
    return(
        <View style={styles.backgroundCol}>
            <View>
                <RNText>Select course from the dropdown to see which tables have students studying for that course</RNText> 
            </View>
            {renderLabel()}
            <Dropdown
                data={courseArray}
                labelField="CourseName"
                valueField="CourseName"
                searchField="CourseName"
                value={value}
                search={true}
                onChange={item =>{
                    setValue(item.CourseName)
                    studyTablesInfo() 
                    console.warn("what is value",value) 
                }}
                searchPlaceholder="Search..."
            />
            <Canvas style={{width: 400, height: 400}}>
                {myTableFilterArray}
            </Canvas>   
        </View>
        
    )
}
const styles = StyleSheet.create({

  container:{
    borderColor: "red",
    borderWidth: 2,
    backgroundColor: '#f0ffff',
  },
  backgroundCol: {
    // App background color
    backgroundColor: '#ecf0e4',
  }
});



