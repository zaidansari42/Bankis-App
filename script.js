'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-10-10T14:11:59.604Z',
    '2022-10-25T17:01:17.194Z',
    '2022-10-28T10:36:17.929Z',
    '2022-10-29T05:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2022-10-05T14:11:59.604Z',
    '2022-10-15T17:01:17.194Z',
    '2022-10-19T10:36:17.929Z',
    '2022-10-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Creating a func for the creation of all the usernames
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name.slice(0, 1))
      .join('');
  });
};

// Calling the username function
createUserName(accounts);

// Creating a function for the current date
const currentTime = function (acc) {
  const today = new Date();
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    // second: 'numeric',
  };

  labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(
    today
  );
  return today;
};

// Creating a function for the currency
const currency = function (acc, money) {
  return Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(money);
};

// Start Logout Timer
const startLogoutTimer = function () {
  let time = 200;

  const tick = function () {
    const minute = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${minute}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
    }

    time--;
  };

  tick();
  const timer = setInterval(tick, 1000);

  return timer;
};

// Creating a balance update and welcome label
const balanceUpdate = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);

  labelBalance.textContent = `${currency(acc, acc.balance)}`;

  labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`;
};

const formatMovementsDate = function (acc, transacDay) {
  // Creating a function for calculating the days passed
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day1 - day2) / (1000 * 60 * 60 * 24));

  // Function to find the new current date and put both the current date and transaction date in to the days passed function
  const today = new Date();

  const x = calcDaysPassed(today, new Date(transacDay));

  if (x === 0) return 'Today';
  if (x === 1) return 'Yesterday';
  if (x <= 7) return `${x} days ago`;
  else {
    const transactionDate = new Date(transacDay);
    // const day = transactionDate.getDate();
    // const month = transactionDate.getMonth() + 1;
    // Always keep in mind to use getFullYear, not getYear as we got an error by using that method
    // const year = transactionDate.getFullYear();
    // return `${day}/${month}/${year}`;
    return Intl.DateTimeFormat(acc.locale).format(transactionDate);
  }
};

// Transaction Update // also setting the sort to false here
const transaction = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  // Formula of Sorted copy of array movements
  const sortedMov = currentUser.movements.slice().sort((a, b) => a - b);

  // If sort is true return sorted or else original movements
  let mov = sort ? sortedMov : acc.movements;

  // for each on both normal and the sorted array
  mov.forEach(function (mov, i) {
    const transactionType = mov < 0 ? 'withdrawal' : 'deposit';

    // Storing all the days passed in a variable
    const transacDays = formatMovementsDate(acc, acc.movementsDates[i]);

    // Storing the currency passed in a vatiable
    const transacCurrency = currency(acc, mov);

    let html = `<div class="movements__row">
    <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${transacDays}</div>
    <div class="movements__value">${transacCurrency}</div>
</div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Account summary Update
const summary = function (acc) {
  const depositsOnly = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const withdrawalsOnly = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + Math.abs(cur), 0);

  const interest = acc.movements
    .filter((mov) => mov > 100)
    .map((mov) => mov * acc.interestRate)
    .reduce((acc, cur) => acc + cur / 100, 0);

  labelSumIn.textContent = `${currency(acc, depositsOnly)}`;
  labelSumOut.textContent = `${currency(acc, withdrawalsOnly)}`;
  labelSumInterest.textContent = `${currency(acc, interest)}`;
};

let currentUser, timer;

const loginUser = function (accs) {
  currentUser = accs.find((acc) => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Starting the logout Timer
    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    // Calling all the functions
    displayUI(currentUser);

    // Calling the function immediately
    currentTime(currentUser);

    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    alert('Sorry, You have either entered a Wrong Username or PIN');
  }
};

// creating a display function
const displayUI = function (acc) {
  balanceUpdate(acc);
  transaction(acc);
  summary(acc);
  containerApp.style.opacity = 1;
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  // finding the user
  loginUser(accounts);
});

const transfer = function (acc, recacc, reamnt) {
  acc.movements.push(-reamnt);
  recacc.movements.push(reamnt);

  const movementTime = currentTime(acc).toISOString();
  acc.movementsDates.push(movementTime);
  recacc.movementsDates.push(movementTime);
};

// Transfer Feauture

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  let receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  const receivingAmount = Number(inputTransferAmount.value);

  if (
    receiverAcc &&
    receivingAmount < currentUser.balance &&
    receiverAcc.username != currentUser.username
  ) {
    // Initiating Transfer and tracking + logging the time inside this
    transfer(currentUser, receiverAcc, receivingAmount);

    // Updating UI
    displayUI(currentUser);

    // Clearing the Timer
    clearInterval(timer);
    timer = startLogoutTimer();

    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  } else {
    alert('Account not found');
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  }
});

// Request Loan Feature

// Any of the deposits made should be at least 10 percent of the requested loan amount

// dep >= 0.10 * loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const reqAmount = Number(inputLoanAmount.value);
  if (
    reqAmount > 0 &&
    currentUser.movements.some((mov) => mov >= 0.1 * reqAmount)
  ) {
    alert(
      `A loan request of sum ${currency(
        currentUser,
        reqAmount
      )} has been initiated`
    );
    const loanTransfer = function () {
      currentUser.movements.push(reqAmount);

      // Pushing the time when the loan was received
      currentUser.movementsDates.push(currentTime(currentUser).toISOString());

      // Clearing the Timer
      clearInterval(timer);
      timer = startLogoutTimer();

      inputLoanAmount.value = '';
      displayUI(currentUser);
    };
    // Passing the loan after 2.5 seconds of requesting
    setTimeout(loanTransfer, 2500);
  } else {
    alert('Loan Amount is too big, Please try again with a less amount.');
  }
});

// Account close Feature
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentUser.username &&
    Number(inputClosePin.value) === currentUser.pin
  ) {
    let index = accounts.findIndex(
      (acc) => acc.username === currentUser.username
    );

    // Removing Acc using splice
    accounts.splice(index, 1);

    inputCloseUsername.value = inputClosePin.value = '';

    // removing display
    containerApp.style.opacity = 0;

    labelWelcome.textContent = 'Log in to get started';
  } else {
    alert('Incorrect Credentials, please try again later');
  }
});

// Sort feature

// sort is off
let sort = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  // sort will become true on the current User
  transaction(currentUser, !sort);
  // updating the sort to opposite value in the constant after enabling it inside the function
  sort = !sort;
  console.log(sort);
});
// Note: The reason why defined the sort again outside because, the sort in the transaction function will be limited to that scope only . The outer variable won't be able to access it. Hence we defined it outside and switched it in the parameter and then updated it after it
