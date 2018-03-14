import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  Picker,
  View
} from 'react-native';
import Button from 'react-native-button';
import Orientation from 'react-native-orientation';
import { 
  categories, 
  categoryLabels, 
  months 
} from '../modules';

export default class InputExpense extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expense: '0',
      category: 'eatingOut'
    };
  }

  componentDidMount() {
    Orientation.unlockAllOrientations();
    Orientation.lockToPortrait();
  }

  handleSubmit = () => {
    const { expense, category } = this.state;
    const currentMonth = months[new Date().getMonth()];

    AsyncStorage.getItem(category).then(res => {
      const calendar = res ? JSON.parse(res) : {
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
      };
      calendar[currentMonth].push(Number(expense));
      AsyncStorage.setItem(category, JSON.stringify(calendar));
    });
  }

  handleExpenseInput = (expense) => {
    if (isNaN(Number(expense))) return;
    this.setState({ expense });
  }

  render() {
    const { expense, category } = this.state;
    const pickerItems = categories.map((category, idx) => {
      return (
        <Picker.Item 
          key={`picker-${idx}`}
          label={categoryLabels[idx]}
          value={category} 
        />
      );
    });

    return (
      <View style={styles.container}>
        <Text style={styles.header}>Input Expense</Text>
        <TextInput
          style={styles.expenseField}
          keyboardType={"numeric"}
          onChangeText={this.handleExpenseInput}
          value={expense}
        />
        <Picker
          itemStyle={styles.categoryItem}
          selectedValue={category}
          onValueChange={(category) => this.setState({ category })}>
          {pickerItems}
        </Picker>
        <Button
          style={styles.submitButton}
          onPress={this.handleSubmit}>
          Submit
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  header: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 25,
  },
  expenseField: {
    alignSelf: 'center',
    textAlign: 'center',
    height: 40,
    width: 300,
    color: '#FFFFFF',
    borderColor: '#D3D3D3',
    borderWidth: 0.3,
    fontFamily: 'Avenir',
    fontSize: 26,
  },
  categoryItem: {
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 26,
  },
  submitButton: {
    alignSelf: 'center',
    marginBottom: 25,
    width: 225,
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontFamily: 'Avenir',
    fontSize: 26,
  },
});
