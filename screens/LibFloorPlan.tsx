//import React, {useState}from 'react';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Box, Canvas, Rect, SkImage, rect, rrect } from '@shopify/react-native-skia';
import FirstFloor from './../screens/FirstLevelCropped.png';
import {Dimensions} from 'react-native';
//import Image from 'react-native-scalable-image';


//<ImageBackground source={require('./FirstLevelCropped.png')} style= {[styles.background]}>
//</ImageBackground>  
export default function LibFloorPlan(){
   
    return(
        
        <SafeAreaView style = {styles.SafeAreaViewContainer}>

            <Image 
                style= {styles.floor}
                source={require('./FirstLevelCropped.png')} 
            />
            <Canvas style={styles.tables}>
                <Box color = "red" box= {rrect(rect(322, 540, 20, 20), 5, 5)}></Box>
                <Box color = "red" box= {rrect(rect(322, 493, 20, 20), 5, 5)}></Box>
                <Box color = "red" box= {rrect(rect(330, 454, 10, 10), 2, 2)}></Box>
                <Box color = "green" box= {rrect(rect(330, 443, 10, 10), 2, 2)}></Box>
            </Canvas>
           

        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
   SafeAreaViewContainer:{
    //flex: 1,
    minWidth: '100%',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    //backgroundColor: '#ECF0E4'
   },

   background:{
    flex: 1,
    resizeMode: 'contain',
    //margin: '3%'
   },

   floor:{
    height: '100%',
    width: '100%',
    //position: 'absolute',
    
    //justifyContent: 'flex-start',
    //alignContent: 'flex-start',
    //paddingHorizontal: 50,
    //paddingVertical: 50,
    //marginTop: '',
    //marginLeft: '20',
   },

   tables:{
    flex: 1.5,
   }

});