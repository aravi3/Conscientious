import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import PieChart from 'react-native-pie-chart';
import Orientation from 'react-native-orientation';
import Button from 'react-native-button';
import {
  categories,
  categoryLabels,
  months,
  toPercentage,
  formatNum
} from '../modules';

export default class Current extends Component {
  constructor(props) {
    super(props);
    this.state = { series: [] };
    this.legendBox = { width: 30, height: 30, marginBottom: 8, marginLeft: 10 };
    this.red = { backgroundColor: '#F44336', color: '#F44336' };
    this.blue = { backgroundColor: '#2196F3', color: '#2196F3' };
    this.yellow = { backgroundColor: '#FFEB3B', color: '#FFEB3B' };
    this.green = { backgroundColor: '#4CAF50', color: '#4CAF50' };
    this.orange = { backgroundColor: '#FF9800', color: '#FF9800' };
    this.purple = { backgroundColor: '#7C6296', color: '#7C6296' };
    this.grey = { backgroundColor: '#969696', color: '#969696' };
    this.brown = { backgroundColor: '#8B6508', color: '#8B6508' };
    this.monthItem = {
      marginTop: 2,
      color: 'rgba(255, 255, 255, 0.75)',
      textAlign: 'center',
      fontFamily: 'Avenir',
      fontWeight: 'bold',
      fontSize: 15
    };
    months.forEach(month => this[month] = {});
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    this.buildSeries(months[new Date().getMonth()]);
  }

  buildSeries = async (selectedMonth) => {
    const incomeRes = await AsyncStorage.getItem('monthlyIncome');
    const monthlyIncome = incomeRes ? Number(incomeRes) : 6600;
    const series = [];
    let categoryTotal;
    let total = 0;

    categories.forEach((category, idx) => {
      AsyncStorage.getItem(category).then(res => {
        if (res) {
          categoryTotal = JSON.parse(res)[selectedMonth].reduce((a, b) => a + b, 0);
          series.push(categoryTotal);
          total += categoryTotal;
        } else {
          series.push(0);
        }

        if (idx === categories.length - 1) {
          series.push(monthlyIncome - total);
          this.setState({ series });
        }
      });
    });
  }

  handleMonthSelection = (month) => {
    return () => {
      months.forEach(month => this[month] = {});
      this[month] = { textDecorationLine: 'underline' };
      this.buildSeries(month);
    };
  }

  render() {
    const series = this.state.series;
    const total = series.reduce((a, b) => a + b, 0);
    const sliceColor = ['#F44336', '#2196F3', '#FFEB3B', '#4CAF50', '#FF9800', '#8B6508', '#969696', '#7C6296'];
    const monthList = months.map((month, idx) => {
      return (
        <TouchableOpacity key={`touch-wrapper-${idx}`} onPress={this.handleMonthSelection(month)} >
          <Text style={{...this[month], ...this.monthItem}} key={`month-${idx}`}>
            {month}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View>
        <View style={styles.chartItem}>
          <PieChart
            style={styles.pieChart}
            chart_wh={250}
            series={series}
            sliceColor={sliceColor}
            doughnut={true}
            coverRadius={0.45}
            coverFill='#1569C7'
          />
          <View style={styles.monthList}>
            {monthList}
          </View>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.red, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[0]} - ${formatNum(series[0])} ({toPercentage(series[0], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.blue, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[1]} - ${formatNum(series[1])} ({toPercentage(series[1], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.yellow, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[2]} - ${formatNum(series[2])} ({toPercentage(series[2], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.green, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[3]} - ${formatNum(series[3])} ({toPercentage(series[3], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.orange, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[4]} - ${formatNum(series[4])} ({toPercentage(series[4], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.brown, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[5]} - ${formatNum(series[5])} ({toPercentage(series[5], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.grey, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            {categoryLabels[6]} - ${formatNum(series[6])} ({toPercentage(series[6], total)}%)
          </Text>
        </View>
        <View style={styles.legendItem}>
          <Button style={{...this.purple, ...this.legendBox}}>''</Button>
          <Text style={styles.text}>
            Savings - ${formatNum(series[7])} ({toPercentage(series[7], total)}%)
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chartItem: {
    flexDirection: 'row',
    marginBottom: 12
  },
  monthList: {
    marginTop: 5,
    marginLeft: 50
  },
  pieChart: {
    marginTop: 13,
    marginLeft: 15
  },
  legendItem: {
    flexDirection: 'row',
  },
  text: {
    marginHorizontal: 20,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 18,
  },
});
