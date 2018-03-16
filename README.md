# Conscientious

Conscientious is a mobile budgeting application developed using React Native. All the 
inputted data is stored locally using AsyncStorage.

![MainPic](http://res.cloudinary.com/dnj5rmvun/image/upload/v1521168355/main_screen_conscientious_rtgvus.jpg)

## Features & Implementation

### First Tab: Expense Input

Users can submit each of their expenses by category. There are seven categories available to choose from: "Eating Out", "Groceries", "Fun", "Household", "Fitness", "Medical", and "Education". When an expense is submitted, it is stored under the current month for the selected category:

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

### Second Tab: Breakdown of Expenses by Month

Users can view a pie chart of their expenses in each category, including the amount in savings, for any month in the current year. The data for the pie chart is generated as follows:

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

### Third Tab: View Progress for Current Year

Users can view line graphs for each category, including the amount saved, of their progress over the current year. The first chart is a multi-series line graph that combines all the data to allow for comparisons across categories. The data for the line graphs are generated as follows:

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

### Fourth Tab: Calculate Metrics Based on Savings Goal

Users can input their monthly income and desired monthly savings target in this tab. After pressing “Save”, the information is used to calculate and display how much money they are allowed to spend in each category, based on their average spending ratios, for the remainder of the current month if they want to hit their savings target. This is the function that performs the “allowance” calculation for each category:

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

This is the equation that specifically calculates the allowance:

```javascript
(spendable * (total[category]/incomeTotal)) - series[idx]
```
where `spendable` is the current month's spendable income (`monthlyIncome - desiredSavings`), `total[category]/incomeTotal` is the average spending ratio for the given category up to the current month, and `series[idx]` is the amount already spent on that category this month.

### Data Storage

All the inputted information is saved locally using AsyncStorage, which is a key-value storage system that is global to the application.
