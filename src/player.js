const Player = function (ownGB, opponentGB, isCpu) {
  //Getting random coordinates
  const getRandomCoordinates = function () {
    let letter = 'A'.charCodeAt(0) + Math.floor(Math.random() * 10);
    let digit = 1 + Math.floor(Math.random() * 10);
    return String.fromCharCode(letter) + digit;
  };
  //check if move is available
  const moveIsAvailable = function (coord) {
    if (
      opponentGB.hits.includes(coord) ||
      opponentGB.missedAttacks.includes(coord)
    ) {
      return false;
    }
    return true;
  };
  //finding proper random move
  const randomMove = function () {
    let coord;
    do {
      coord = getRandomCoordinates();
    } while (!moveIsAvailable(coord));
    return coord;
  };
  //computer move depends on if there is an opponent's injured ship
  const cpuMove = function () {
    let coord;
    //random move if there is not injured ship
    if (!cpuHits.length) {
      coord = randomMove();
    } else {
      coord = findBestMove(); //finding best coordinates for move
    }
    //delayed resolved for simulating computer's reflecting
    return new Promise((resolve) => {
      opponentGB.hitAttack(coord);
      analysePreviousMove(coord, opponentGB);
      setTimeout(() => resolve(coord), 500);
    });
  };
  //Analysing all move options
  const weighAllOptions = function () {
    cpuHits.forEach((mem) => mem.weighOptions(opponentGB));
  };
  //finding the option for move with the highest value
  const findBestMove = function () {
    weighAllOptions();
    let moves = cpuHits.map((elem) => {
      return elem.getMax();
    });
    let maxWeight = -200;
    let bestMove = '';
    moves.forEach((elem) => {
      if (elem && elem.weight > maxWeight) {
        maxWeight = elem.weight;
        bestMove = elem.coord;
      }
    });
    return bestMove;
  };
  //post analysyng depends on if prvious move made ship sunc
  const analysePreviousMove = function (coord, opponentGB) {
    if (
      opponentGB.hits.includes(coord) &&
      !opponentGB.findShipByCoord(coord).isSunc()
    ) {
      let memoryHit = new cpuMemory(coord);
      memoryHit.getCoordsForAttack(opponentGB);
      cpuHits.push(memoryHit);
    } else if (
      opponentGB.hits.includes(coord) &&
      opponentGB.findShipByCoord(coord).isSunc()
    ) {
      cpuHits = [];
    }
  };
  //object that keeps previous successful coordinates of injured ship
  // every object is kept in array until ship is not sunc
  class cpuMemory {
    constructor(hit) {
      (this.hit = hit),
        (this.left = {
          coord: null,
          weight: 0,
        }),
        (this.right = {
          coord: null,
          weight: 0,
        }),
        (this.top = {
          coord: null,
          weight: 0,
        }),
        (this.bottom = {
          coord: null,
          weight: 0,
        });
    }
    // init neighbour line coordinates
    getCoordsForAttack(gb) {
      let coordObj = gb.detectCoordinates(this.hit);
      let minCharCode = 'A'.charCodeAt(0);
      let maxCharCode = 'J'.charCodeAt(0);
      let row = [];
      row.push(coordObj.letter.charCodeAt(0) - 1);
      row.push(coordObj.letter.charCodeAt(0) + 1);
      if (row[0] >= minCharCode && row[0] <= maxCharCode) {
        this.left.coord = String.fromCharCode(row[0]) + coordObj.digit;
      }
      if (row[1] >= minCharCode && row[1] <= maxCharCode) {
        this.right.coord = String.fromCharCode(row[1]) + coordObj.digit;
      }

      let col = [];
      col.push(coordObj.digit - 1);
      col.push(coordObj.digit + 1);
      if (col[0] >= 1 && col[0] <= 10) {
        this.top.coord = coordObj.letter + col[0];
      }
      if (col[1] >= 1 && col[1] <= 10) {
        this.bottom.coord = coordObj.letter + col[1];
      }
    }
    // evaluating each neighbour coordinate
    weighOptions(gb) {
      //if field has hit or missed shoot value is the lowest
      for (let key in this) {
        if (
          this[key].coord &&
          (gb.missedAttacks.includes(this[key].coord) ||
            gb.hits.includes(this[key].coord))
        ) {
          this[key].weight = -100;
        }
      }
      // opposite to hitted coordinate has +100 value
      // opposite to missed coordinate has +50 value
      for (let key in this) {
        if (this[key].weight === -100) {
          if (
            key === 'left' &&
            this.right.coord !== null &&
            !this.right.weight
          ) {
            this.right.weight += gb.hits.includes(this[key].coord) ? 100 : 50;
          }
          if (
            key === 'right' &&
            this.left.coord !== null &&
            !this.left.weight
          ) {
            this.left.weight += gb.hits.includes(this[key].coord) ? 100 : 50;
          }
          if (
            key === 'top' &&
            this.bottom.coord !== null &&
            !this.bottom.weight
          ) {
            this.bottom.weight += gb.hits.includes(this[key].coord) ? 100 : 50;
          }
          if (key === 'bottom' && this.top.coord !== null && !this.top.weight) {
            this.top.weight += gb.hits.includes(this[key].coord) ? 100 : 50;
          }
        }
      }
    }
    //return object with max weight
    getMax() {
      let maxWeight = -1000;
      let resObj = null;
      for (let key in this) {
        if (
          this[key].coord &&
          this[key].weight > maxWeight &&
          this[key].weight >= 0
        ) {
          maxWeight = this[key].weight;
          resObj = this[key];
        }
      }
      return resObj;
    }
  }
  //keeps all cpu successfull hits until ship is non sunc
  let cpuHits = [];

  const playerMove = function (coord) {
    opponentGB.hitAttack(coord);
  };

  return {
    ownGB,
    opponentGB,
    isCpu,
    cpuMemory,
    moveIsAvailable,
    cpuMove,
    playerMove,
    getRandomCoordinates,
    findBestMove,
    cpuHits,
  };
};

export default Player;
