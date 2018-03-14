import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  View
} from 'react-native';
import Icon from 'react-native-fa-icons';
import Tabs from './components/tabs';
import InputExpense from './components/tabs/input';
import Current from './components/tabs/current';
import Historical from './components/tabs/historical';
import InputInfo from './components/tabs/info';
import { categories, months } from './components/modules';

export default class App extends Component {
  constructor(props) {
    super(props);
    const currentYear = new Date().getFullYear().toString();

    AsyncStorage.getItem('currentYear').then(res => {
      if (res) {
        if (res !== currentYear) {
          categories.forEach(category => {
            AsyncStorage.setItem(category, JSON.stringify({
              'Jan': [],
              'Feb': [],
              'Mar': [],
              'Apr': [],
              'May': [],
              'Jun': [],
              'Jul': [],
              'Aug': [],
              'Sep': [],
              'Oct': [],
              'Nov': [],
              'Dec': []
            }));
          });
          AsyncStorage.setItem('currentYear', currentYear);
        }
      } else {
        AsyncStorage.setItem('currentYear', currentYear);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Tabs>
          <InputExpense title={<Icon name='info' />} />
          <Current title={<Icon name='pie-chart'/>} />
          <Historical title={<Icon name='line-chart' />} />
          <InputInfo title={<Icon name='calculator' />} />
        </Tabs>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1569C7'
  }
});
