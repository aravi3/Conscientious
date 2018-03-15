import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';
import Orientation from 'react-native-orientation';
import Button from 'react-native-button';
import {
  categories,
  categoryLabels,
  months,
  formatNum
} from '../modules';

export default class InputInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      income: '0',
      desiredSavings: '0',
      allowance: [],
      series: []
    };
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
    this.fetchExistingInfo();
    this.fetchCurrentExpenditures();
  }

  fetchCurrentExpenditures = () => {
    const series = [];
    const currentMonth = months[new Date().getMonth()]
    let categoryTotal;

    categories.forEach(category => {
      AsyncStorage.getItem(category).then(res => {
        if (res) {
          categoryTotal = JSON.parse(res)[currentMonth].reduce((a, b) => a + b, 0);
          series.push(categoryTotal);
        } else {
          series.push(0);
        }
      });
    });

    this.setState({ series });
  }

  fetchExistingInfo = async () => {
    const res = await AsyncStorage.getItem('monthlyIncome');
    const income = res ? res : '6600';
    const res2 = await AsyncStorage.getItem('desiredSavings');
    const desiredSavings = res2 ? res2 : '0';
    this.setState({ income, desiredSavings });
  }

  calculateAllowance = () => {
    let { income, desiredSavings, series } = this.state;
    income = Number(income);
    desiredSavings = Number(desiredSavings);
    const spendable = income - desiredSavings;
    const allowance = [];
    const currMonth = new Date().getMonth() + 1;
    const numOfMonths = currMonth === 1 ? 1 : currMonth - 1;
    const incomeTotal = income * numOfMonths;
    const total = {
      eatingOut: 0,
      groceries: 0,
      fun: 0,
      household: 0,
      fitness: 0,
      medical: 0,
      education: 0
    };

    categories.forEach((category, idx) => {
      AsyncStorage.getItem(category).then(res => {
        for (let i = 0; i < 12; i++) {
          if (res) {
            total[category] += JSON.parse(res)[months[i]].reduce((a, b) => a + b, 0);
          }

          if (i + 1 === numOfMonths) {
            console.log(spendable);
            console.log(total[category]/incomeTotal);
            console.log(series[idx]);
            allowance.push((spendable * (total[category]/incomeTotal)) - series[idx]);

            if (allowance.length === categories.length) {
              this.setState({ allowance });
            }

            break;
          }
        }
      });
    });
  }

  handleSave = () => {
    const { income, desiredSavings } = this.state;
    AsyncStorage.setItem('monthlyIncome', income);
    AsyncStorage.setItem('desiredSavings', desiredSavings);
    this.calculateAllowance();
  }

  handleInfoInput = (stateKey) => {
    return (num) => {
      if (isNaN(Number(num))) return;

      if (stateKey === 'income') {
        this.setState({ income: num });
      } else {
        this.setState({ desiredSavings: num });
      }
    };
  }

  render() {
    const { income, desiredSavings } = this.state;
    const allowance = this.state.allowance.map((amt, idx) => {
      return (
        <Text style={styles.listItem} key={`allowance-${idx}`}>
          {categoryLabels[idx]} - ${formatNum(amt)}
        </Text>
      );
    });

    return (
      <View>
        <View style={styles.inputItem}>
          <Text style={styles.text}>Monthly income:</Text>
          <TextInput
            style={styles.infoField}
            keyboardType={"numeric"}
            onChangeText={this.handleInfoInput('income')}
            value={income}
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.text}>Desired savings:</Text>
          <TextInput
            style={styles.infoField}
            keyboardType={"numeric"}
            onChangeText={this.handleInfoInput('desiredSavings')}
            value={desiredSavings}
          />
        </View>
        <Button
          style={styles.saveButton}
          onPress={this.handleSave}>
          Save
        </Button>
        <Text style={styles.header}>
          The following is what you have left to spend this month
          to meet your savings goal, based on your average spending ratios:
        </Text>
        <View style={styles.list}>
          {allowance}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  infoField: {
    width: 150,
    color: '#FFFFFF',
    textAlign: 'left',
    fontFamily: 'Avenir',
    fontSize: 26,
  },
  inputItem: {
    flexDirection: 'row'
  },
  list: {
    marginLeft: 95,
    marginTop: 8
  },
  listItem: {
    marginTop: 20,
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 18
  },
  header: {
    marginLeft: 17,
    marginTop: 20,
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text: {
    marginTop: 2,
    marginHorizontal: 20,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 20,
  },
  saveButton: {
    marginTop: 20,
    marginLeft: 70,
    width: 225,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 22
  },
});
