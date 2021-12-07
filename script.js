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
  movementsDates:[
  '2019-11-18T21:31:17.178Z',
  '2019-12-18T21:30:17.178Z',
  '2019-10-18T21:29:17.178Z',
  '2019-09-18T21:10:17.178Z',
  '2019-08-18T21:24:17.178Z',
  '2021-12-03T21:45:16.178Z',
  '2021-12-06T21:25:17.178Z',
  '2021-12-05T21:15:17.178Z',
  ],
  locale: 'en-US',
  currency: 'USD'
}


const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates:[
    '2019-11-18T21:31:17.178Z',
    '2019-12-18T21:30:17.178Z',
    '2019-10-18T21:29:17.178Z',
    '2019-09-18T21:10:17.178Z',
    '2019-08-18T21:24:17.178Z',
    '2019-07-18T21:45:17.178Z',
    '2021-12-05T21:25:17.178Z',
    '2021-12-06T21:15:17.178Z',
    ],
    locale: 'pt-PT',
    currency: 'EUR'
  };

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates:[
    '2019-11-18T21:31:17.178Z',
    '2019-12-18T21:30:17.178Z',
    '2019-10-18T21:29:17.178Z',
    '2019-09-18T21:10:17.178Z',
    '2019-08-18T21:24:17.178Z',
    '2019-07-18T21:45:17.178Z',
    '2019-06-18T21:25:17.178Z',
    '2019-05-18T21:15:17.178Z',
    ],
    locale: 'en-US',
    currency: 'USD'
  };

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates:[
    '2019-11-18T21:31:17.178Z',
    '2019-12-18T21:30:17.178Z',
    '2019-10-18T21:29:17.178Z',
    '2019-09-18T21:10:17.178Z',
    '2019-08-18T21:24:17.178Z',
    '2019-07-18T21:45:17.178Z',
    '2019-06-18T21:25:17.178Z',
    '2019-05-18T21:15:17.178Z',
    ],
    locale: 'pt-PT',
    currency: 'EUR'
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// DISPLAY MOVEMENT

const formatMovementsDates = function(date, locale){
  const calcDaysPassed = (days1, days2) => Math.round(Math.abs(days2 -days1)/(1000*60*60*24));
  const daysPassed = calcDaysPassed(date, new Date());
  if (daysPassed===0) {
    return "Today"
  } else if(daysPassed===1){
    return "Yesterday"
  } else if (daysPassed<=7) {
    return `${daysPassed} days ago`
  } else{
  return new Intl.DateTimeFormat(locale).format(date);
  }
}

const formatCurrency = function(mov, locale, currency){
  return Intl.NumberFormat(locale, {style:"currency", currency: currency, useGrouping: true}).format(mov)
}

const displayMovements = function(acc, sort=false){
  containerMovements.innerHTML = "";
const newMovements = sort? acc.movements.slice().sort((a, b) => a-b):acc.movements

  newMovements.forEach((movement, i) => {
    const type =movement >0 ? "deposit" : "withdrawal";
    const formatedDate = formatMovementsDates(new Date(acc.movementsDates[i]), acc.locale);
    const formattedMov = formatCurrency(movement, acc.locale, acc.currency)
   const movementsRow =`<div class="movements__row">
   <div class="movements__type movements__type--${type}">
     ${i+1} ${type}
   </div>
   <div class="movements__date">${formatedDate}</div>
   <div class="movements__value">${formattedMov}</div>
 </div>`
 containerMovements.insertAdjacentHTML("afterbegin", movementsRow)
  });
}
// DISPLAY BALANCE

const displayBalance = function(acc){
  acc.balance = acc.movements.reduce((mov, item)=>mov+item,0);
labelBalance.textContent = formatCurrency(acc.balance, acc.locale, acc.currency)
}

// DISPLAY SUMMARY

const displaySummary = function(acc){
  const incomes = acc.movements.filter(mov => mov>0)
  .reduce((accu, mov1) => accu+mov1, 0);
  const outcomes = acc.movements.filter(mov => mov<0)
  .reduce((accu, mov1) => accu+mov1,0);
const interests= acc.movements.filter(mov => mov>0)
.map(mov1 => mov1*acc.interestRate/100)
.filter(mov2 => mov2>1)
.reduce((accu, mov3) => accu+mov3);
 labelSumIn.textContent= formatCurrency(incomes, acc.locale, acc.currency);
 labelSumOut.textContent=formatCurrency(Math.abs(outcomes), acc.locale, acc.currency);
 labelSumInterest.textContent=formatCurrency(interests, acc.locale, acc.currency);
}

// CREATE USERNAME

const createUserNames = function(accs){
  accs.forEach(function (acc)  {
    acc.userName = acc.owner.toLowerCase()
    .split(" ")
    .map(name => name[0])
    .join("")
  });
}
createUserNames(accounts);

function updateUI(currentAccount){
  displayBalance(currentAccount);
  displayMovements(currentAccount);
  displaySummary(currentAccount);
  if (timer) {
    clearInterval(timer)
  }
  startLogoutTimer();
}

const startLogoutTimer = function(){
  let time = 70;
  const timerFn = function(){
  const min = String(Math.trunc(time/60)).padStart(2,0);
  const sekund = String(time%60).padStart(2,0);
  labelTimer.textContent = `${min}:${sekund}`;
  if (time===0) {
    clearInterval(timer);
    currentAccount=undefined;
    containerApp.classList.add("d-none")
    labelDate.textContent="";
    labelWelcome.textContent="Log in to get started"
  }
  time--;
  }
  timerFn();
  timer = setInterval(timerFn,1000)
  return timer
}

// EVENT HANDLER
let currentAccount, timer;

btnLogin.addEventListener("click", function(evt){
  evt.preventDefault();
  currentAccount = accounts.find(acc => acc.userName===inputLoginUsername.value)
  if (currentAccount?.pin===+(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(" ")[0]}`
    containerApp.classList.remove("d-none");
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, {hour:"numeric", minute: "numeric", day: "numeric", month: "long", year: "numeric"}).format(new Date())
    inputLoginUsername.value="";
    inputLoginPin.value="";

    updateUI(currentAccount)
  }
})

btnTransfer.addEventListener("click", function(evt){
  evt.preventDefault();
  const amount = +(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.userName===inputTransferTo.value)
  inputTransferTo.value=inputTransferAmount.value=""
  if (amount>0&&currentAccount.balance>=amount&&receiverAcc&& receiverAcc?.userName!==currentAccount.userName) {
   currentAccount.movements.push(-amount);
   receiverAcc.movements.push(amount);
   currentAccount.movementsDates.push(new Date().toISOString())
   receiverAcc.movementsDates.push(new Date().toISOString())
   updateUI(currentAccount);
  }
})

btnClose.addEventListener("click", function(evt){
  evt.preventDefault();
  if (inputCloseUsername.value===currentAccount.userName&&+(inputClosePin.value)===currentAccount.pin) {
  const index = accounts.findIndex(acc => acc.userName===inputCloseUsername.value);
  accounts.splice(index, 1);
  currentAccount=undefined;
  containerApp.classList.add("d-none");
  inputClosePin.value=inputCloseUsername.value=labelDate.textContent=labelWelcome.textContent="";
  }
})

btnLoan.addEventListener("click", function(evt){
  evt.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount>0 && currentAccount.movements.some(mov => mov > amount*0.1)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString())
    updateUI(currentAccount)
  }
})
let sorted = false;
btnSort.addEventListener("click", function(evt){
  evt.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted)

})
