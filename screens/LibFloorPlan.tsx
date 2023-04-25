//import React, {useState}from 'react';
import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image, Dimensions} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Box, Canvas, Rect, SkImage, rect, rrect, translate, transformOrigin } from '@shopify/react-native-skia';
import FirstFloor from './../screens/FirstLevelCropped.png';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
//import {Dimensions} from 'react-native';
//import Image from 'react-native-scalable-image';


//<ImageBackground source={require('./FirstLevelCropped.png')} style= {[styles.background]}>
//</ImageBackground>  

const {width, height} = Dimensions.get('window'); 

const screenWidth = width;
const screenHieght = height;

/* Here i'm thinking a getTableStatus function that takes in a table number, checks the database, if open then return the string "green", else return "red" */

export default function LibFloorPlan(){
    const [boxColors, setBoxColors] = useState(Array(7).fill(''));
    const boxArray = [
        <Box key={1} color={boxColors[0]} box={rrect(rect(screenWidth/2 +90, screenHieght/2 +135, 20, 20), 5, 5)}></Box>,
        <Box key={2} color={boxColors[1]} box={rrect(rect(screenWidth/2 +90, screenHieght/2 +105, 20, 20), 5, 5)}></Box>,
        <Box key={3} color={boxColors[2]} box={rrect(rect(screenWidth/2 +60, screenHieght/2 +135, 20, 20), 5, 5)}></Box>,
        <Box key={4} color={boxColors[3]} box={rrect(rect(screenWidth/2 +60, screenHieght/2 +105, 20, 20), 5, 5)}></Box>,
        <Box key={5} color={boxColors[4]} box={rrect(rect(screenWidth/2 +50, screenHieght/2 +62, 20, 20), 5, 5)}></Box>,
        <Box key={6} color={boxColors[5]} box={rrect(rect(screenWidth/2 +96, screenHieght/2 +79, 10, 10), 2, 2)}></Box>,
        <Box key={7} color = {boxColors[6]} box= {rrect(rect(screenWidth/2 +96, screenHieght/2 +70, 10, 10), 2, 2)}></Box>       
]
    useEffect(() =>{
        async function setTableStatus(){
            for(let i = 0; i< boxArray.length;i++){
                let response = await axios.get(`http://44.203.31.97:3001/data/api/tables/status/${boxArray[i].key}`)
                let response2 = await axios.get(`http://44.203.31.97:3001/data/api/courses/atTable/${boxArray[i].key}`)
                let courses = await response2.data[0].Courses
                const tableStatusFree: boolean =  await response.data[0].TableStatusFree
                if(tableStatusFree){ //table is open
                    setBoxColors(prevState => [...prevState.slice(0, i), 'green', ...prevState.slice(i+1)]);
                } else if(!tableStatusFree && courses.length > 0){ //courses are being studied
                    setBoxColors(prevState => [...prevState.slice(0, i), 'yellow', ...prevState.slice(i+1)]);
                }
                else if(!tableStatusFree && courses.length === 0){
                    setBoxColors(prevState => [...prevState.slice(0, i), 'red', ...prevState.slice(i+1)]);
                }
            }
        }
        setTableStatus()
    }, [])

    function refresh(){
        setTableStatus()
    }

    async function setTableStatus(){
        for(let i = 0; i< boxArray.length;i++){
            let response = await axios.get(`http://44.203.31.97:3001/data/api/tables/status/${boxArray[i].key}`)
            let response2 = await axios.get(`http://44.203.31.97:3001/data/api/courses/atTable/${boxArray[i].key}`)
            let courses = await response2.data[0].Courses
            const tableStatusFree: boolean =  await response.data[0].TableStatusFree
            if(tableStatusFree){ //table is open
                setBoxColors(prevState => [...prevState.slice(0, i), 'green', ...prevState.slice(i+1)]);
            } else if(!tableStatusFree && courses.length > 0){ //courses are being studied
                setBoxColors(prevState => [...prevState.slice(0, i), 'yellow', ...prevState.slice(i+1)]);
            }
            else if(!tableStatusFree && courses.length === 0){
                setBoxColors(prevState => [...prevState.slice(0, i), 'red', ...prevState.slice(i+1)]);
            }
        }
    }
    return(
        <SafeAreaView style = {styles.SafeAreaViewContainer}>
            <Image 
                style= {styles.floor}
                source={require('./FirstLevelCropped.png')} 
            />
            <View style = {styles.tables}>
                <Canvas style={styles.tables}>
                  {boxArray}
                </Canvas>
            </View>
            <TouchableOpacity onPress={refresh} style={styles.containerRefresh}>
                <Text style={styles.refreshText}>
                    Refresh
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
   SafeAreaViewContainer:{
    flex: 1,
    //minWidth: '100%',
    //minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'white',
    backgroundColor: '#ECF0E4'
   },
   background:{
    flex: 1,
    resizeMode: 'contain',
    backgroundColor: 'pink'
    //margin: '3%'
   },

   floor:{
    height: 500,
    width: 500/1.5,
    position: 'absolute',
    top: screenHieght/2 -250,
    left: screenWidth/2 - 166.5,
   
   },
   tables:{
    ... StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',

   }, 

   table1:{
    color: 'red',
   },
   containerRefresh: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    position: 'absolute',
    top: 0,
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },

});