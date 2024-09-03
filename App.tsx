/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { fontFamilies } from './src/constants/fontFamily';
import HomeScreen from './src/Screen/homeScrenn';
import AddNewTask from './src/Screen/AddNewTask';
import SearchSceen from './src/Screen/SearchScreen';
import SearchScreen from './src/Screen/SearchScreen';
import LoginScreen from './src/Screen/auth/LoginScreen';
import Router from './src/routers/Router';
const App = ()=> {
  const Stack=createNativeStackNavigator();
  const MainNavigator = (
    <Stack.Navigator initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
    </Stack.Navigator>
  );
  const AuthNavigator = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      {/* <Stack.Screen name="RegisterScreen" component={RegisterScreen} /> */}
    </Stack.Navigator>
  );
  return (
    <SafeAreaView style={{flex:1}}>
      <NavigationContainer>
        <Router/>
      </NavigationContainer>
      
    </SafeAreaView>
    
  );
};
export default App;
