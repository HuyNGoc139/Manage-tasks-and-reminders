/**
 * @format
 */

import {AppRegistry} from 'react-native';
import { Text } from 'react-native';
import { useState } from 'react';
import App from './App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => App);
