const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-length]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]")
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
// circle grey

handleSlider();

setIndicator("#ccc");
//slider 
function handleSlider () {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 /(max - min)) + "% 100%";
}

//Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 5px ${color}`;
}

//get random integer
function getRndNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//generate random number
function generateRandomNumber() {
    return getRndNumber(0, 9);
}

//generate random lowercase letter
function generateLowercase() {
    return String.fromCharCode(getRndNumber(97, 123));
}

//generate random uppercase letter
function generateUppercase() {
  return String.fromCharCode(getRndNumber(65, 90));
}

//generate random symbol
function generateSymbol() {
    let rndNum = getRndNumber(0, symbols.length);
    return symbols.charAt(rndNum);
}

//check strength and give color
function calcStrength() {
    let hasNum = false;
    let hasLower = false;
    let hasUpper = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength >= 6) {
      setIndicator("#ff0");
    }
    else {
        setIndicator("#f00");
    }
}

// copy password
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }

    copyMsg.classList.add('active');
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}


function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}


copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value)
        copyContent();
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//checkbox event listener
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });
    console.log(checkCount);
}
allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckBoxChange);
});

generateBtn.addEventListener('click', () => {
    if (checkCount <= 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";

    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUppercase);
    if (lowercaseCheck.checked) funcArr.push(generateLowercase);
    if (numbersCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked) funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    for (let i = funcArr.length; i < passwordLength; i++) {
        let rndIndex = getRndNumber(0, funcArr.length);
        password += funcArr[rndIndex]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;

    calcStrength();

})

