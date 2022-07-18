// import Gameboard from './gameboard';
import randomIcon from '../src/icons/icons8-shuffle-24.png';
import shortcutIcon from '../src/icons/icons8-accuracy-20.png';

const Display = (function () {
  let link = document.createElement('link');
  link.rel = 'shortcut icon';
  link.type = 'image/x-icon';
  link.href = shortcutIcon;
  document.getElementsByTagName('head')[0].appendChild(link);

  document.querySelector('body').innerHTML = `
        <header>
          <div class="logo"></div>
          <div class="status"></div>
        </header>
        <div class="content">
            <div class="field"></div>
            <div class="field"></div>
            <div class="controllers">
              <div class="info">
                <p >Your field</p>
                <a id="randomise" href="#">randomise ships<img id="randImg"></a>
              </div>
              <div class="info">
                <p>Enemy field</p>
              </div>
            </div>
        </div>
        <footer>
          <div>
                <button id="start" status="init">Start the battle!
                </button>
          </div>
          <div class="author">Created by aabelikoff &#174;</div>
          <div class="notes">&#9755;
            <a target="_blank" href="https://icons8.com/icon/wFEdCwKpOBHs/battle">Battle</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
            &#9755;
            <a target="_blank" href="https://icons8.com/icon/rxrY0sbH8IgH/shuffle">Shuffle</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
            &#9755;
            <a target="_blank" href="https://icons8.com/icon/24921/accuracy">Accuracy</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
          </div>
        </footer>
  `;

  const createCell = function () {
    let cell = document.createElement('div');
    cell.classList.add('cell');
    return cell;
  };
  // Creates a field of cells 11x11
  const inputCells = function (parentNode) {
    let initCode = 'A'.charCodeAt(0) - 1;
    let char;
    for (let i = 0; i < 11; i++) {
      for (let k = 0; k < 11; k++) {
        let cell = createCell();
        char = String.fromCharCode(initCode + k);
        if (!i && !k) {
          cell.classList.add('name');
        } else if (!i || !k) {
          cell.classList.add('name'); //for detecting coordinates
          if (!i) {
            cell.textContent = char;
          }
          if (!k) {
            cell.textContent = i;
          }
        } else {
          cell.classList.add('simple'); //for ships
          cell.setAttribute('coord', char + i);
        }
        parentNode.appendChild(cell);
      }
    }
  };
  //Constants
  const leftField = document.querySelectorAll('.field')[0]; //player field
  const rightField = document.querySelectorAll('.field')[1]; //cpu field
  const startBtn = document.querySelector('#start');
  const status = document.querySelector('.status'); //information about game status
  const randomise = document.querySelector('#randomise');
  const randImg = document.querySelector('#randImg');

  randImg.src = randomIcon;

  inputCells(leftField);
  inputCells(rightField);
  //One button for game starting and ship placing stages
  const toggleButtons = function () {
    if (startBtn.getAttribute('status') === 'start') {
      startBtn.textContent = 'Place ships';
      startBtn.setAttribute('status', 'init');
    } else {
      startBtn.textContent = 'Start the battle!';
      startBtn.setAttribute('status', 'start');
    }
  };
  //Switches on and off inactive state of the button
  const toggleInactiveButton = function () {
    if (startBtn.classList.contains('inactive')) {
      startBtn.classList.remove('inactive');
    } else {
      startBtn.classList.add('inactive');
    }
  };

  const findCellByCoord = function (field, letterDigit) {
    let cellArray = Array.from(field.childNodes);
    return cellArray.find((cell) => cell.getAttribute('coord') === letterDigit);
  };

  const drawShips = function (field, gb) {
    gb.shipContainer.forEach((ship) => {
      ship.coordinates.forEach((coord) => {
        findCellByCoord(field, coord).classList.add('myShip');
      });
    });
  };

  const drawShoot = function (field, gb) {
    gb.hits.forEach((coord) => {
      let cell = findCellByCoord(field, coord);
      cell.classList.add('hit');
      if (field === rightField) {
        cell.classList.add('enemyShip');
      }
    });
    gb.missedAttacks.forEach((coord) => {
      findCellByCoord(field, coord).classList.add('miss');
    });
  };

  const eraseField = function (field) {
    let cellArray = field.querySelectorAll('.simple');
    cellArray.forEach((cell) => {
      if (cell.classList.contains('hit')) {
        cell.classList.remove('hit');
      }
      if (cell.classList.contains('miss')) {
        cell.classList.remove('miss');
      }
      if (cell.classList.contains('myShip')) {
        cell.classList.remove('myShip');
      }
      if (cell.classList.contains('enemyShip')) {
        cell.classList.remove('enemyShip');
      }
      if (cell.classList.contains('moving')) {
        cell.classList.remove('moving');
      }
    });
  };

  const eraseFields = function () {
    eraseField(leftField);
    eraseField(rightField);
  };

  const delay = function (ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  // Effect of typing in status-bar
  const setStatus = async function (str) {
    status.textContent = '';
    let chars = str.split('');
    for (const item in chars) {
      await delay(30);
      status.textContent += chars[item];
    }
    return Promise.resolve();
  };

  return {
    leftField,
    rightField,
    startBtn,
    status,
    randomise,
    drawShips,
    findCellByCoord,
    drawShoot,
    eraseField,
    eraseFields,
    setStatus,
    toggleButtons,
    toggleInactiveButton,
  };
})();

export default Display;
