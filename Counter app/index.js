const content = document.querySelector('.diplay-num');

//increment function
function increment() {
    let val = content.textContent;
    val = Number.parseInt(val) + 1;
    content.textContent = val;
}

//decrement function
function decrement() {
  let val = content.textContent;
  val = Number.parseInt(val) - 1;
  content.textContent = val;
}