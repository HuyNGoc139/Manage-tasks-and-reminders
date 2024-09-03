import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import HomeScreen from '../Screen/homeScrenn';
import AddNewTask from '../Screen/AddNewTask';
import SearchScreen from '../Screen/SearchScreen';
import LoginScreen from '../Screen/auth/LoginScreen';
import auth from '@react-native-firebase/auth'
import RegisterScreen from '../Screen/auth/RegisterScreen';
import TaskDetail from '../Screen/TaskDetail';

const Router = () => {
  

  const Stack = createNativeStackNavigator();
  const MainNavigator = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="AddNewTask" component={AddNewTask} />
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetail} />
    </Stack.Navigator>
  );
  const AuthNavigator = (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
<Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );

  const [isLogin, setIsLogin] = useState(false);
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setIsLogin(true);
      } else {
        setIsLogin(false);
      }
    });
  }, []);
    

  return isLogin ? MainNavigator : AuthNavigator;
};

export default Router;
