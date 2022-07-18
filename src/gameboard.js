import Ship from './ship';

const Gameboard = function () {
  let field = {
    A: [],
    B: [],
    C: [],
    D: [],
    E: [],
    F: [],
    G: [],
    H: [],
    I: [],
    J: [],
  };
  //Keeps all ships
  const shipContainer = [];
  const missedAttacks = []; //Keeps all missed shoots
  const hits = []; //All successfull shoots
  //Abnulling cells
  for (let key in field) {
    let a = null;
    for (let i = 0; i < 10; i++) {
      field[key].push(a);
    }
  }
  //Splits coordinate from 'LetterDigit'
  const detectCoordinates = function (letterDigit) {
    let reg = /^([A-J])(\d+)$/;
    let regObj = letterDigit.match(reg);
    if (!regObj) {
      return;
    }
    let l = regObj[1];
    let d = regObj[2];
    d = parseInt(d, 10);
    return {
      letter: l,
      digit: d,
    };
  };
  //Difines if ship could be disposed at certain place
  const isEnoughPlace = function (fromCoord, length, horisontal = true) {
    let coordinates = detectCoordinates(fromCoord);
    let difference;
    if (horisontal) {
      difference = 'J'.charCodeAt(0) - coordinates.letter.charCodeAt(0) + 1;
    } else {
      difference = 10 - coordinates.digit + 1;
    }
    return difference >= length ? true : false;
  };
  //Finds if there is a ship with such coordinate
  const findShipCoord = function (letterDigit) {
    let res = false;
    shipContainer.forEach((ship) => {
      if (ship.coordinates) {
        if (ship.coordinates.includes(letterDigit)) {
          res = ship;
        }
      }
    });
    return res;
  };
  // Finds ship with proper coordinate
  const findShipByCoord = function (letterDigit) {
    return shipContainer.find((ship) => {
      return ship.coordinates.includes(letterDigit);
    });
  };
  // Returns closest coordinates to certain one
  const findFieldsToVerify = function (fromCoord) {
    let coordinates = detectCoordinates(fromCoord);
    let maxCharCode = 'J'.charCodeAt(0);
    let minCharCode = 'A'.charCodeAt(0);
    let fieldsArray = [];
    let initLetterCode = coordinates.letter.charCodeAt(0) - 1;
    let initDigit = coordinates.digit - 1;
    for (let i = 0; i < 3; i++) {
      let letterCode = initLetterCode + i;
      if (letterCode >= minCharCode && letterCode <= maxCharCode) {
        for (let k = 0; k < 3; k++) {
          let digit = initDigit + k;
          if (digit >= 1 && digit <= 10) {
            let str = String.fromCharCode(letterCode) + digit;
            fieldsArray.push(str);
          }
        }
      }
    }
    return fieldsArray;
  };
  // detects if there is a close ship near one cell
  const isCloseShip = function (letterDigit) {
    let fieldsArray = findFieldsToVerify(letterDigit);
    let res = false;
    fieldsArray.forEach((field) => {
      if (findShipCoord(field)) {
        res = true;
      }
    });
    return res;
  };
  // detects if there is a close ship near all celles in particular ship
  const checkForCloseShips = function (fromCoord, length, horisontal = true) {
    let coordObj = detectCoordinates(fromCoord);

    for (let i = 0; i < length; i++) {
      let str = '';
      if (horisontal) {
        str =
          String.fromCharCode(coordObj.letter.charCodeAt(0) + i) +
          coordObj.digit;
      } else {
        str = coordObj.letter + (coordObj.digit + i);
      }
      if (isCloseShip(str)) {
        return true;
      }
    }
    return false;
  };

  const createShipCoordinates = function (
    fromCoord,
    length,
    horisontal = true
  ) {
    let coordinates = [fromCoord];
    let coordObj = detectCoordinates(fromCoord);

    for (let i = 1; i < length; i++) {
      let str = '';
      if (horisontal) {
        str =
          String.fromCharCode(coordObj.letter.charCodeAt(0) + i) +
          coordObj.digit;
      } else {
        str = coordObj.letter + (coordObj.digit + i);
      }
      coordinates.push(str);
    }
    return coordinates;
  };

  const createShip = function (length) {
    let ship = Ship(length);
    shipContainer.push(ship);
    return ship;
  };

  const createAllShips = function () {
    for (let i = 4; i >= 1; i--) {
      for (let k = 1; k <= 4; k++) {
        if (i + k <= 5) {
          createShip(i);
        }
      }
    }
  };

  const getRandomData = function () {
    let direction = Math.floor(2 * Math.random());
    let letter = 'A'.charCodeAt(0) + Math.floor(Math.random() * 10);
    let digit = 1 + Math.floor(Math.random() * 10);
    let fromCoord = String.fromCharCode(letter) + digit;
    return {
      fromCoord,
      direction,
    };
  };

  const resetAllShipCoordinates = function () {
    shipContainer.forEach((ship) => {
      ship.coordinates = [];
    });
  };

  const randomPlaceShips = function () {
    if (!shipContainer.length) {
      return;
    }
    resetAllShipCoordinates();
    shipContainer.sort((a, b) => {
      return b.length - a.length;
    });
    shipContainer.forEach((ship) => {
      let randomData;
      do {
        randomData = getRandomData();
      } while (!placeShip(randomData.fromCoord, ship, randomData.direction));
    });
  };

  const placeShip = function (fromCoord, ship, horisontal = true) {
    if (
      !isEnoughPlace(fromCoord, ship.length, horisontal) ||
      checkForCloseShips(fromCoord, ship.length, horisontal)
    ) {
      return false;
    }

    let coordinates = createShipCoordinates(fromCoord, ship.length, horisontal);
    ship.coordinates = coordinates;
    ship.horisontal = horisontal;
    return true;
  };

  const hitAttack = function (letterDigit) {
    let col = detectCoordinates(letterDigit).letter;
    let row = detectCoordinates(letterDigit).digit;
    if (field[col][row - 1]) {
      return;
    }
    let ship = findShipByCoord(letterDigit);
    if (ship) {
      field[col][row - 1] = 'hit';
      hits.push(letterDigit);
      ship.hit();
    } else {
      field[col][row - 1] = 'miss';
      missedAttacks.push(letterDigit);
    }
    if (ship && ship.isSunc()) {
      aroundSunkShip(ship);
    }
    return true;
  };

  const hitAround = function (coord) {
    let fields = findFieldsToVerify(coord);
    fields.forEach((elem) => {
      let row = detectCoordinates(elem).letter;
      let col = detectCoordinates(elem).digit;
      if (!field[row][col - 1]) {
        field[row][col - 1] = 'miss';
        missedAttacks.push(elem);
      }
    });
  };
  // Defines all free cells around particular ship as missed attacks
  const aroundSunkShip = function (ship) {
    ship.coordinates.forEach((coord) => {
      hitAround(coord);
    });
  };
  //Checks for every ship is sunc
  const allShipsSunk = function () {
    let num = shipContainer.reduce((res, ship) => {
      return ship.isSunc() ? (res += 1) : res;
    }, 0);
    return num === shipContainer.length; // ? true : false;
  };

  const eraseShipCoordinates = function (ship) {
    ship.coordinates = [];
  };

  const rotateShip = function (ship) {
    let safeCoord = ship.coordinates;
    eraseShipCoordinates(ship);
    if (!placeShip(safeCoord[0], ship, !ship.horisontal)) {
      ship.coordinates = safeCoord;
    }
  };

  const moveShip = function (ship, toCoord) {
    let safeCoord = ship.coordinates;
    eraseShipCoordinates(ship);
    if (!placeShip(toCoord, ship, ship.horisontal)) {
      ship.coordinates = safeCoord;
    }
  };

  const rotateShipCoord = function (letterDigit) {
    let ship = findShipByCoord(letterDigit);
    rotateShip(ship);
  };
  //Get information about commeted shoot
  const getInfoShoot = function (coord) {
    let str = '';
    if (missedAttacks.includes(coord)) {
      str = 'Missed shot.';
    }
    if (hits.includes(coord)) {
      str = 'Hit!!! ';
      let ship = findShipByCoord(coord);
      if (ship.isSunc()) {
        str += `${ship.length}-deck ship sunk!!!`;
      } else {
        str += `Ship was damaged.`;
      }
    }
    return str;
  };
  // get information about left ships

  return {
    field,
    shipContainer,
    hits,
    missedAttacks,
    detectCoordinates,
    isEnoughPlace,
    createShipCoordinates,
    placeShip,
    createShip,
    findShipCoord,
    findFieldsToVerify,
    isCloseShip,
    checkForCloseShips,
    findShipByCoord,
    hitAttack,
    allShipsSunk,
    randomPlaceShips,
    createAllShips,
    rotateShip,
    rotateShipCoord,
    moveShip,
    getInfoShoot,
  };
};

export default Gameboard;
