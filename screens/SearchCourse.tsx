import React, {useState}from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Button} from 'react-native';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import { Alert } from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';


export default function SearchCourse(){
    
    return(
        <TouchableOpacity>
            <Text>Search for Course Page</Text>
        </TouchableOpacity>
        
    )
}


