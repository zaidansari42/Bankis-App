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
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

// Creating a balance update and welcome label
const balanceUpdate = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur);

  labelBalance.textContent = `${acc.balance}€`;

  labelWelcome.textContent = `Welcome back, ${acc.owner.split(' ')[0]}`;
};

// Transaction Update
const transaction = function (acc) {
  containerMovements.innerHTML = '';
  acc.movements.forEach(function (mov, i) {
    const transactionType = mov < 0 ? 'withdrawal' : 'deposit';

    let html = `<div class="movements__row">
    <div class="movements__type movements__type--${transactionType}">${
      i + 1
    } ${transactionType}</div>
    <div class="movements__date">${i + 1} days ago</div>
    <div class="movements__value">${Math.abs(mov)}€</div>
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

  labelSumIn.textContent = `${depositsOnly}€`;
  labelSumOut.textContent = `${withdrawalsOnly}€`;
  labelSumInterest.textContent = `${interest}€`;
};

let currentUser;

const loginUser = function (accs) {
  currentUser = accs.find((acc) => acc.username === inputLoginUsername.value);

  if (currentUser?.pin === Number(inputLoginPin.value)) {
    // Calling all the functions
    displayUI(currentUser);

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
    // Initiating Transfer
    transfer(currentUser, receiverAcc, receivingAmount);

    // Updating UI
    displayUI(currentUser);

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
  if (currentUser.movements.some((mov) => mov >= 0.1 * reqAmount)) {
    currentUser.movements.push(reqAmount);
    inputLoanAmount.value = '';
    displayUI(currentUser);
  } else {
    alert('Loan Amount is too big, Please try again with a less amount.');
  }
});

// btnClose
// inputCloseUsername
// inputClosePin

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

btnSort.addEventListener('click', function () {
  const sortedMov = currentUser.movements.sort((a, b) => a - b);
});
