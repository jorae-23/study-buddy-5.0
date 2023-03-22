import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import { Dropdown } from 'react-native-element-dropdown';
import { Canvas, rect, Box} from '@shopify/react-native-skia';

interface courseDesc{
    CourseCode: string,
    CourseName: string,
}

type courses = courseDesc[]

export default function SearchCourse(){
    const [value, setValue] = useState<string | null>(null)
    let courseArray: courses = []

    async function courseListDropDown(){
        const response = await axios.get(`http://34.201.13.238:3001/data/api/g/c/b/courses`)
        for(let i = 0; i< response.data.length;i++){
            courseArray.push(response.data[i])
        }

        const response2 = await axios.get(`http://34.201.13.238:3001/data/api/curate/specific/studytables`)
        //console.warn(response2.data)
    } 

    const renderLabel = () =>{
        courseListDropDown()
            return(
                <Text>
                    Course
                </Text>
            )
    }

    return(
        <View>
            <View>
                <Text>Select course from the dropdown to see which tables have students studying for that course</Text> 
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
                    console.warn(value)
                }}
                searchPlaceholder="Search..."
            />

            <Canvas style={{width: 400, height: 400}}>
                <Box box={rect(20,350,50,50)}></Box>
                <Box box={rect(100,350,50,50)}></Box>
                <Box box={rect(180,350,50,50)}></Box>
            </Canvas>   
        </View>
        
    )
}
const styles = StyleSheet.create({

  });



