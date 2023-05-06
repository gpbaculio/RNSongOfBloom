import 'react-native-gesture-handler';

import {StyleSheet} from 'react-native';
import React from 'react';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {SongOfBloom} from './SongOfBloom';

const App = () => (
  <GestureHandlerRootView style={styles.container}>
    <SongOfBloom />
  </GestureHandlerRootView>
);

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
