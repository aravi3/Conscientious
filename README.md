# Conscientious

Conscientious is a mobile budgeting application developed using React Native. All the 
inputted data is stored locally using AsyncStorage.

![MainPic](http://res.cloudinary.com/dnj5rmvun/image/upload/v1501870092/main_screen_hdooyz.png)

## Features & Implementation

### Expense Input

Description

```javascript
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
```

### Breakdown of Expenses by Month

Description

```javascript
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
```

### View Progress for Current Year

Description

```javascript
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
```

### Calculate Metrics Based on Savings Goal

Description

```javascript
categories.forEach((category, idx) => {
    AsyncStorage.getItem(category).then(res => {
    for (let i = 0; i < 12; i++) {
        if (res) {
        total[category] += JSON.parse(res)[months[i]].reduce((a, b) => a + b, 0);
        }

        if (i + 1 === numOfMonths) {
        allowance.push((spendable * (total[category]/incomeTotal)) - series[idx]);

        if (allowance.length === categories.length) {
            this.setState({ allowance });
        }

        break;
        }
    }
    });
});
```
