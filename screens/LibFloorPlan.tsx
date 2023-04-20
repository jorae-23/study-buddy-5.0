//import React, {useState}from 'react';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ImageBackground, Image, Dimensions} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Box, Canvas, Rect, SkImage, rect, rrect, translate, transformOrigin } from '@shopify/react-native-skia';
import FirstFloor from './../screens/FirstLevelCropped.png';
//import {Dimensions} from 'react-native';
//import Image from 'react-native-scalable-image';


//<ImageBackground source={require('./FirstLevelCropped.png')} style= {[styles.background]}>
//</ImageBackground>  

const {width, height} = Dimensions.get('window'); 

const screenWidth = width;
const screenHieght = height;

const table1color = "red";
const table2color = "green";
const table3color = "yellow";

export default function LibFloorPlan(){
   
    return(
        
        <SafeAreaView style = {styles.SafeAreaViewContainer}>

            <Image 
                style= {styles.floor}
                source={require('./FirstLevelCropped.png')} 
            />
            <View style = {styles.tables}>
                
                
                <Canvas style={styles.tables}>
                    {/* large tables */}
                    
                    <Box color = {table1color} box= {rrect(rect(screenWidth/2 +90, screenHieght/2 +135, 20, 20), 5, 5)}></Box>
                    <Box color = {table2color} box= {rrect(rect(screenWidth/2 +90, screenHieght/2 +105, 20, 20), 5, 5)}></Box>
                    <Box color={table3color} box= {rrect(rect(screenWidth/2 +60, screenHieght/2 +135, 20, 20), 5, 5)}></Box>
                    <Box color = "green" box= {rrect(rect(screenWidth/2 +60, screenHieght/2 +105, 20, 20), 5, 5)}></Box>
                    <Box color = "green" box= {rrect(rect(screenWidth/2 +50, screenHieght/2 +62, 20, 20), 5, 5)}></Box>
                    {/* single seats */}
                    <Box color = "red" box= {rrect(rect(screenWidth/2 +96, screenHieght/2 +79, 10, 10), 2, 2)}></Box>
                    <Box color = "green" box= {rrect(rect(screenWidth/2 +96, screenHieght/2 +70, 10, 10), 2, 2)}></Box>
                </Canvas>
            </View>
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
    backgroundColor: 'white',
    //backgroundColor: '#ECF0E4'
   },

   background:{
    flex: 1,
    resizeMode: 'contain',
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
   }

});