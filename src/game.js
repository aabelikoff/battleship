import Gameboard from './gameboard';
import Player from './player';
import Display from './display';

class Game {
  constructor() {
    this.cpuGB;
    this.humanGB;
    this.human;
    this.cpu;
    this.cpuMove;
    this.gameStatus;
  }

  newGame() {
    this.gameStatus = false;
    this.cpuGB = Gameboard();
    this.humanGB = Gameboard();
    this.human = Player(this.humanGB, this.cpuGB, false);
    this.cpu = Player(this.cpuGB, this.humanGB, true);
    this.cpuMove = Math.floor(Math.random() * 2);
    this.cpuGB.createAllShips();
    this.humanGB.createAllShips();
  }

  checkGameStatus() {
    if (this.cpuGB.allShipsSunk() || this.humanGB.allShipsSunk()) {
      this.gameStatus = false;
    }
    return this.gameStatus;
  }

  async gameStep(coord) {
    let str = '';
    if (this.gameStatus && !this.cpuMove) {
      this.cpuMove = true;
      this.human.playerMove(coord);
      str = 'Your shot: ' + coord + '. ' + this.cpuGB.getInfoShoot(coord);
      Display.drawShoot(Display.rightField, this.cpuGB);
      await Display.setStatus(str);
      this.checkGameStatus();
    }
    if (this.gameStatus && this.cpuMove) {
      let c = await this.cpu.cpuMove();
      str = "Enemy's shot: " + c + '. ' + this.humanGB.getInfoShoot(c);
      Display.drawShoot(Display.leftField, this.humanGB);
      await Display.setStatus(str);

      this.checkGameStatus();
      this.cpuMove = false;
    }
    if (!this.gameStatus) {
      this.finishGame();
    }
  }

  finishGame() {
    if (!this.humanGB.allShipsSunk() && !this.cpuGB.allShipsSunk()) {
      return;
    }
    let winStr = '';
    if (!this.humanGB.allShipsSunk()) {
      winStr = 'Congratulatulations! You are the winner!';
    } else if (this.humanGB.allShipsSunk()) {
      winStr = 'Sorry! You lose!';
    }
    Display.setStatus(winStr);
    Display.startBtn.setAttribute('status', 'init');
    Display.toggleInactiveButton();
  }

  async initGame() {
    Display.startBtn.setAttribute('status', 'inactive');
    this.newGame();
    this.gameStatus = false;
    this.cpuGB.randomPlaceShips();
    this.humanGB.randomPlaceShips();
    Display.eraseFields();
    await Display.setStatus(
      'Welcome to the new game. Follow the instructions.'
    );
    await Display.setStatus(
      'Drag and drop to place your ships. Double click to rotate. Ships can\'t be disposed side by side. Press "Start the battle!" to start.'
    );
    Display.drawShips(Display.leftField, this.humanGB);
    Display.startBtn.setAttribute('status', 'start');
  }

  async startGame() {
    this.gameStatus = true;
    this.cpuMove = Math.floor(Math.random() * 2);
    let str = 'Game is on.';
    this.cpuMove
      ? (str += ' Computer shoots first.')
      : (str += ' You shoot first.');
    await Display.setStatus(str);
    if (this.cpuMove) {
      this.gameStep();
    }
  }
}

export default Game;
