import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Canvas, rect, Rect,Box, SkiaView,Text as SkiaText, useFont, SkFont} from '@shopify/react-native-skia';

import { ContinousBaseGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture';

import DeviceInfo from 'react-native-device-info';

async function id(){
    const uniqueId = await DeviceInfo.getUniqueId()
    console.warn(uniqueId)
}

function ok(){
    id()
    return(
        <Text>Yummy</Text>
    )
}

export default function MyTable(){
    return(
    <View style={styles.container}>
        <Text>My table</Text>
        <Text>Broad Cast</Text>
        <Canvas style={{width: 500, height: 500}}>
            <Box box={rect(115,350,150,150)}></Box>
        </Canvas>
        {ok()}
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      // App background color
      backgroundColor: '#ecf0e4',
    }
})