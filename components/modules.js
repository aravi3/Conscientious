export const categories = [
  'eatingOut',
  'groceries',
  'fun',
  'household',
  'transportation',
  'health',
  'education'
];

export const categoryLabels = [
  'Eating Out',
  'Groceries',
  'Fun',
  'Household',
  'Transportation',
  'Health',
  'Education'
];

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

export const toPercentage = (num, total) => Math.round((num/total)*100);

export const formatNum = (num) => {
  if (num === undefined) return;

  const numString = Math.round(num).toString();
  let result = '';
  let count = 0;

  for (let i = numString.length - 1; i >= 0; i--) {
    result = numString[i] + result;
    count++;

    if (count === 3 && i > 0) {
      result = ',' + result;
      count = 0;
    }
  }

  return result;
};