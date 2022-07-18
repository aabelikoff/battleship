import Display from './display';

const Events = (game) => {
  let tempShipInfo = {};

  Display.startBtn.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.getAttribute('status') === 'inactive') {
      return;
    }
    if (event.target.getAttribute('status') === 'init' && game.gameStatus) {
      return;
    }
    if (event.target.getAttribute('status') === 'start' && !game.gameStatus) {
      game.startGame();
      Display.toggleInactiveButton();
    } else if (
      event.target.getAttribute('status') === 'init' &&
      !game.gameStatus
    ) {
      game.initGame();
    }
    Display.toggleButtons();
  });

  Display.randomise.addEventListener('click', (event) => {
    event.preventDefault();
    if (
      Display.startBtn.getAttribute('status') === 'inactive' ||
      Display.startBtn.getAttribute('status') === 'init'
    ) {
      return;
    }
    if (
      !game.gameStatus &&
      Display.startBtn.getAttribute('status') === 'start'
    ) {
      game.humanGB.randomPlaceShips();
      Display.eraseField(Display.leftField);
      Display.drawShips(Display.leftField, game.humanGB);
    }
  });

  function clickEnemyCell(event) {
    event.preventDefault();
    if (!game.gameStatus) {
      return;
    }
    if (event.target.classList.contains('simple') && !game.cpuMove) {
      let coord = event.target.getAttribute('coord');
      game.gameStep(coord);
    }
  }

  function doubleClickMyCell(event) {
    if (!game.gameStatus) {
      let coord = event.target.getAttribute('coord');
      game.humanGB.rotateShipCoord(coord);
      Display.eraseField(Display.leftField);
      Display.drawShips(Display.leftField, game.humanGB);
    }
  }

  Display.rightField.addEventListener('click', clickEnemyCell);
  Display.leftField.addEventListener('dblclick', doubleClickMyCell);

  function mouseDown(event) {
    if (game.gameStatus) {
      return;
    }
    let elem = event.target;
    let fromCoord = elem.getAttribute('coord');
    let ship = game.humanGB.findShipByCoord(fromCoord);
    if (!ship) {
      return;
    }
    tempShipInfo.fromElem = elem;
    tempShipInfo.ship = ship;
    tempShipInfo.fromCoord = fromCoord;
    tempShipInfo.pos = ship.coordinates.findIndex((elem) => {
      return elem === fromCoord;
    });
    event.preventDefault();
  }

  function newFromCoord(ship, coordTo) {
    let resCoord;
    let letter = game.humanGB.detectCoordinates(coordTo).letter;
    let digit = game.humanGB.detectCoordinates(coordTo).digit;
    if (ship.horisontal) {
      resCoord =
        String.fromCharCode(letter.charCodeAt(0) - tempShipInfo.pos) + digit;
    } else {
      resCoord = letter + (digit - tempShipInfo.pos);
    }
    return resCoord;
  }

  function fieldsToEnlight(currentCoord) {
    let fromCoord = newFromCoord(tempShipInfo.ship, currentCoord);
    let coordinates = game.humanGB.createShipCoordinates(
      fromCoord,
      tempShipInfo.ship.length,
      tempShipInfo.ship.horisontal
    );
    let cells = coordinates.map((coord) => {
      return Display.leftField.querySelector(`[coord=${coord}]`);
    });
    return cells;
  }

  function enlightFields(cells, prop) {
    let elems = Display.leftField.querySelectorAll('.simple');
    elems.forEach((elem) => {
      if (cells.includes(elem)) {
        elem.classList.add(prop);
      } else {
        elem.classList.remove(prop);
      }
    });
  }

  function mouseOver(event) {
    if (!tempShipInfo.ship) {
      return;
    }
    let elem = event.target;
    let cells = fieldsToEnlight(elem.getAttribute('coord'));
    enlightFields(cells, 'moving');
    event.preventDefault();
  }

  function mouseLeave(event) {
    if (!tempShipInfo.ship) {
      return;
    }
    let elem = event.target;
    elem.classList.remove('moving');
    event.preventDefault();
  }

  function mouseUp(event) {
    let elemTo = event.target;
    let toCoord = elemTo.getAttribute('coord');
    if (!tempShipInfo.fromElem) {
      return;
    }
    let shiftCoord = newFromCoord(tempShipInfo.ship, toCoord);
    game.humanGB.moveShip(tempShipInfo.ship, shiftCoord);
    tempShipInfo = {};
    Display.eraseField(Display.leftField);
    Display.drawShips(Display.leftField, game.humanGB);
    event.preventDefault();
  }

  let cells = Array.from(Display.leftField.querySelectorAll('.simple'));
  cells.forEach((elem) => {
    elem.addEventListener('mousedown', mouseDown);
    elem.addEventListener('mouseup', mouseUp);
    elem.addEventListener('mouseover', mouseOver);
  });
};

export default Events;
