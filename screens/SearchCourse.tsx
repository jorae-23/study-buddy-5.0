import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet,} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import  Dropdown  from 'react-native-material-dropdown';



export default function SearchCourse(){
   const [course, setSelectedCourse] = useState<number | undefined>();

   const handleSelect = (index: number, value: string) => {
    setSelectedCourse(index);
    console.log(`Selected option: ${value}`);
   };


    let courses: string[] = [] 
    async function getCoursesPromise(){
        let courseArray: string[] = []
        try{
            const response = await axios.get('http://10.20.45.60:3001/data/api/g/c/b/courses')
            for(let i = 0; i < response.data.length; i++){
                courseArray.push(response.data[i].CourseCode)
            }
        } catch(error){
            console.warn('something went wrong getting courses', error)
        }
        console.warn(courseArray)
        return courseArray
    }

    async function getCourses() {
        courses = await getCoursesPromise();
        //console.log(courses); // [ 'Course1', 'Course2', 'Course3', ... ]
        // you can do more with the courses array here
    }
    getCourses()
    console.log(courses)

    //const options = courses.map((item, index) => ({ value: item, label: `Option ${index + 1}` }));

    

    return(
        <View style={style.container}>
            <Text style={style.textContainer}>Select course from the dropdown to see which tables have students stuyding for that course</Text>
            <TouchableOpacity>
                <Text>Get Courses</Text>
            </TouchableOpacity>
        </View>

    )
}

const style = StyleSheet.create({
    container:{
        flex: 1,
        padding: 20,
        marginTop: 20, 
    },
    textContainer:{
        fontSize: 25,
        textAlign: 'center'
   }
})
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dropdown: {
      width: 200,
      height: 40,
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: '#fff',
      padding: 10,
    },
    dropdownText: {
      fontSize: 16,
    },
    dropdownContainer: {
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: '#fff',
      padding: 10,
    },
  });


