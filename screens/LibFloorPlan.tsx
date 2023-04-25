//import React, {useState}from 'react';
import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image, Dimensions, BackHandler} from 'react-native';
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
    const [boxColors, setBoxColors] = useState(Array(11).fill(''));
    const boxArray = [
        <Box key={1} color={boxColors[0]} box={rrect(rect(screenWidth/2 +86, screenHieght/2 +135, 20, 20), 5, 5)}></Box>,
        <Box key={2} color={boxColors[1]} box={rrect(rect(screenWidth/2 +86, screenHieght/2 +104, 20, 20), 5, 5)}></Box>,
        <Box key={3} color={boxColors[2]} box={rrect(rect(screenWidth/2 +48, screenHieght/2 +40, 20, 20), 5, 5)}></Box>, //no table here
        <Box key={4} color={boxColors[3]} box={rrect(rect(screenWidth/2 +49, screenHieght/2 +104, 20, 20), 5, 5)}></Box>,
        <Box key={5} color={boxColors[4]} box={rrect(rect(screenWidth/2 +48, screenHieght/2 +62, 20, 20), 5, 5)}></Box>,
        <Box key={6} color={boxColors[5]} box={rrect(rect(screenWidth/2 +95, screenHieght/2 +77, 10, 10), 3, 3)}></Box>,
        <Box key={7} color={boxColors[6]} box={rrect(rect(screenWidth/2 +95, screenHieght/2 +68, 10, 10), 3, 3)}></Box>,
        <Box key={8} color={boxColors[7]} box={rrect(rect(screenWidth/2 +95, screenHieght/2 +41, 10, 10), 3, 3)}></Box>,
        <Box key={9} color={boxColors[8]} box={rrect(rect(screenWidth/2 +95, screenHieght/2 +33, 10, 10), 3, 3)}></Box>,
        <Box key={10} color={boxColors[9]} box={rrect(rect(screenWidth/2 +86, screenHieght/2 -3, 20, 20), 5, 5)}></Box>
    ]       
    useEffect(() =>{
        async function setTableStatus(){
            for(let i = 0; i< boxArray.length;i++){
                let response = await axios.get(`http://44.203.31.97:3001/data/api/tables/status/${boxArray[i].key}`)
                let response2 = await axios.get(`http://44.203.31.97:3001/data/api/courses/atTable/${boxArray[i].key}`)
                let courses = await response2.data[0].Courses
                const tableStatusFree: boolean =  await response.data[0].TableStatusFree
                if(tableStatusFree){ //table is open
                    setBoxColors(prevState => [...prevState.slice(0, i), '#86cba6', ...prevState.slice(i+1)]);
                } else if(!tableStatusFree && courses.length > 0){ //courses are being studied
                    setBoxColors(prevState => [...prevState.slice(0, i), '#fbe29c', ...prevState.slice(i+1)]);
                }
                else if(!tableStatusFree && courses.length === 0){
                    setBoxColors(prevState => [...prevState.slice(0, i), '#ff3d41', ...prevState.slice(i+1)]);
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
                setBoxColors(prevState => [...prevState.slice(0, i), '#86cba6', ...prevState.slice(i+1)]);
            } else if(!tableStatusFree && courses.length > 0){ //courses are being studied
                setBoxColors(prevState => [...prevState.slice(0, i), '#fbe29c', ...prevState.slice(i+1)]);
            }
            else if(!tableStatusFree && courses.length === 0){
                setBoxColors(prevState => [...prevState.slice(0, i), '#ff3d41', ...prevState.slice(i+1)]);
            }
        }
    }
    return(
        <SafeAreaView style = {styles.SafeAreaViewContainer}>
            <View style={styles.keyContainer}>
              <View style={styles.keyBox}>
                    <Text style={[styles.keyText, {fontWeight: 'bold'}, {fontSize: 20}, {textAlign: 'center'}]}>Key</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, lineHeight: 24, paddingRight: 10, color: 'black'}} adjustsFontSizeToFit={true}>{'\u2022'}</Text>
                        <Text style={styles.keyText}>Green - Table is open to public</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, lineHeight: 24, paddingRight: 10, color: 'black'}} adjustsFontSizeToFit={true}>{'\u2022'}</Text>
                        <Text style={styles.keyText}>Yellow - Table is open to study a course</Text>
                    </View>
                        
                    <View style={{flexDirection: 'row'}}>
                        <Text style={{fontSize: 16, lineHeight: 24, paddingRight: 10, color: 'black'}} adjustsFontSizeToFit={true}>{'\u2022'}</Text>
                        <Text style={styles.keyText}>Red - Table is closed to public</Text>
                    </View>
                </View>
            </View>

            <Image style= {styles.floor} source={require('./FirstLevelCropped.png')}/>
            <View style = {styles.tables}>
                <Canvas style={styles.tables}>
                    {boxArray}
                </Canvas>
            </View>

            <View style={styles.refreshContainer}>
                <TouchableOpacity onPress={refresh} style={styles.refreshBox}>
                    <Text style={styles.refreshText} adjustsFontSizeToFit={true}>Refresh</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
   SafeAreaViewContainer:{
    flex: 1,
    backgroundColor: '#ecf0e4'
   },
   keyContainer: {
    flex: 7,
   },
   keyBox: {
    flex: 0.17,
    borderRadius: 10,
    marginTop: 10,
    padding: '3%',
    backgroundColor: '#fbe29c',
    width: '90%',
    height: '100%',
    alignSelf: 'center',
    justifyContent: 'center'
   },
   keyText: {
    textAlign: 'left',
    fontSize: 18,
    color: 'black'
   },
   imageContainer: {
    flex: 5,
    alignSelf: 'flex-start'
   },
   floor:{
    height: 500,
    width: 500/1.5,
    position: 'absolute',
    top: screenHieght/2 -250,
    left: screenWidth/2 - 166.5
   },
   tables:{
    ... StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center'
   }, 
   refreshContainer:{
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
   },
   refreshBox: { 
    flex: 1,
    padding: '3%',
    marginBottom: '5%',
    maxHeight: '100%',
    maxWidth: '50%',
    borderRadius: 10,
    backgroundColor: '#86cba6',
    justifyContent: 'center'
   },
   refreshText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black'
  }
});