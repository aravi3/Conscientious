import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  ScrollView
} from 'react-native';
import Orientation from 'react-native-orientation';
import PureChart from 'react-native-pure-chart';
import { categories, months } from '../modules';

export default class Historical extends Component {
  constructor(props) {
    super(props);

    this.state = {
      series: {
        eatingOut: [],
        groceries: [],
        fun: [],
        household: [],
        fitness: [],
        medical: [],
        education: [],
        savings: []
      }
    };
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
    this.buildSeries();
  }

  buildSeries = async () => {
    const incomeRes = await AsyncStorage.getItem('monthlyIncome');
    const monthlyIncome = incomeRes ? Number(incomeRes) : 5000;
    const series = {
      eatingOut: [],
      groceries: [],
      fun: [],
      household: [],
      fitness: [],
      medical: [],
      education: [],
      savings: []
    };
    const total = {
      'Jan': 0,
      'Feb': 0,
      'Mar': 0,
      'Apr': 0,
      'May': 0,
      'Jun': 0,
      'Jul': 0,
      'Aug': 0,
      'Sep': 0,
      'Oct': 0,
      'Nov': 0,
      'Dec': 0
    };
    let dataPoint;
    let categoryTotal;

    categories.forEach((category, idx) => {
      AsyncStorage.getItem(category).then(res => {
        months.forEach(month => {
          dataPoint = { x: month, y: undefined };

          if (res) {
            categoryTotal = JSON.parse(res)[month].reduce((a, b) => a + b, 0);
            dataPoint.y = categoryTotal;
            total[month] += categoryTotal;
          } else {
            dataPoint.y = 0;
          }

          series[category].push(dataPoint);

          if (idx === categories.length - 1) {
            series['savings'].push({
              x: month,
              y: monthlyIncome - total[month]
            });

            if (month === 'Dec') this.setState({ series });
          }
        });
      });
    });
  }

  render() {
    const series = this.state.series;
    const multiSeries = [];
    let seriesName, data, color;
    let dummyData = [{ x: 'Jan', y: 0 }];

    Object.keys(series).forEach(category => {
      switch (category) {
        case 'eatingOut':
          seriesName = 'Eating Out';
          color = '#F44336';
          break;
        case 'groceries':
          seriesName = 'Groceries';
          color = '#2196F3';
          break;
        case 'fun':
          seriesName = 'Fun';
          color = '#FFEB3B';
          break;
        case 'household':
          seriesName = 'Household';
          color = '#4CAF50';
          break;
        case 'fitness':
          seriesName = 'Fitness';
          color = '#FF9800';
          break;
        case 'medical':
          seriesName = 'Medical';
          color = '#8B6508';
          break;
        case 'education':
          seriesName = 'Education';
          color = '#969696';
          break;
        case 'savings':
          seriesName = 'Savings';
          color = '#7C6296';
          break;
      }

      data = series[category].length > 0 ? series[category] : dummyData;

      multiSeries.push({ seriesName, data, color });
    });

    return (
      <ScrollView>
        <Text style={styles.firstTitle}>All</Text>
        <PureChart data={multiSeries} type='line' />
        <Text style={styles.title}>Eating Out</Text>
        <PureChart data={series.eatingOut} type='line' />
        <Text style={styles.title}>Groceries</Text>
        <PureChart data={series.groceries} type='line' />
        <Text style={styles.title}>Fun</Text>
        <PureChart data={series.fun} type='line' />
        <Text style={styles.title}>Household</Text>
        <PureChart data={series.household} type='line' />
        <Text style={styles.title}>Fitness</Text>
        <PureChart data={series.fitness} type='line' />
        <Text style={styles.title}>Medical</Text>
        <PureChart data={series.medical} type='line' />
        <Text style={styles.title}>Education</Text>
        <PureChart data={series.education} type='line' />
        <Text style={styles.title}>Savings</Text>
        <PureChart data={series.savings} type='line' />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  firstTitle: {
    marginHorizontal: 20,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
  title: {
    marginHorizontal: 20,
    marginTop: 12,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
});
