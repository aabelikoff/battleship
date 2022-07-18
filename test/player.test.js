import Player from '../src/player';
import Gameboard from '../src/gameboard';

describe('Testing player factory', () => {
  let human;
  let cpu;
  let playerGB;
  let cpuGB;

  beforeEach(() => {
    playerGB = Gameboard();
    cpuGB = Gameboard();
    playerGB.createAllShips();
    cpuGB.createAllShips();
    playerGB.randomPlaceShips();
    cpuGB.randomPlaceShips();
    human = Player(playerGB, cpuGB, false);
    cpu = Player(cpuGB, playerGB, true);
  });

  test('Is move available?', () => {
    cpuGB = Gameboard();
    cpuGB.createAllShips();
    cpuGB.placeShip('B2', cpuGB.shipContainer[0]);
    expect(human.moveIsAvailable('A1')).toBeTruthy();
    human.opponentGB.hitAttack('A1');
    expect(human.opponentGB.missedAttacks[0]).toEqual('A1');
    expect(human.opponentGB.missedAttacks.includes('A1')).toBeTruthy();
    expect(human.opponentGB.missedAttacks.includes('A2')).toBeFalsy();
    expect(human.moveIsAvailable('A1')).toBeFalsy();
    expect(human.moveIsAvailable('A4')).toBeTruthy();
    expect(human.opponentGB.hitAttack('A4')).toBeTruthy();
    expect(human.moveIsAvailable('A4')).toBeFalsy();
  });

  test('CPU move', () => {
    playerGB = Gameboard();
    cpuGB = Gameboard();
    cpu.cpuMove();
    expect(
      cpu.opponentGB.missedAttacks.length + cpu.opponentGB.hits.length
    ).toBe(1);
  });

  test('Testing cpuMemory class', () => {
    playerGB = Gameboard();
    let testShip = playerGB.createShip(3);
    playerGB.placeShip('C3', testShip);
    cpu = Player(cpuGB, playerGB, true);

    cpu.playerMove('C3');
    let mem = new cpu.cpuMemory('C3');
    expect(mem.hit).toEqual('C3');
    mem.getCoordsForAttack(playerGB);
    expect(mem.left.coord).toEqual('B3');
    expect(mem.right.coord).toEqual('D3');
    expect(mem.top.coord).toEqual('C2');
    expect(mem.bottom.coord).toEqual('C4');

    mem.weighOptions(playerGB);
    expect(mem.left.weight).toBe(0);
    expect(mem.right.weight).toBe(0);
    expect(mem.top.weight).toBe(0);
    expect(mem.bottom.weight).toBe(0);

    expect(mem.getMax().coord).toEqual('B3');

    cpu.playerMove('B3');
    mem.weighOptions(playerGB);
    expect(mem.left.weight).toBe(-100);
    expect(mem.right.weight).toBe(50);
    expect(mem.top.weight).toBe(0);
    expect(mem.bottom.weight).toBe(0);
    expect(mem.getMax().coord).toEqual('D3');

    cpu.playerMove('D3');
    mem.weighOptions(playerGB);
    expect(mem.left.weight).toBe(-100);
    expect(mem.right.weight).toBe(-100);
    expect(mem.top.weight).toBe(0);
    expect(mem.bottom.weight).toBe(0);
    expect(mem.getMax().coord).toEqual('C2');

    cpu.playerMove('C2');
    mem.weighOptions(playerGB);
    expect(mem.left.weight).toBe(-100);
    expect(mem.right.weight).toBe(-100);
    expect(mem.top.weight).toBe(-100);
    expect(mem.bottom.weight).toBe(50);
    expect(mem.getMax().coord).toEqual('C4');

    cpu.playerMove('C4');
    mem.weighOptions(playerGB);
    expect(mem.left.weight).toBe(-100);
    expect(mem.right.weight).toBe(-100);
    expect(mem.top.weight).toBe(-100);
    expect(mem.bottom.weight).toBe(-100);

    let mem_1 = new cpu.cpuMemory('A1');
    expect(mem_1.hit).toEqual('A1');
    mem_1.getCoordsForAttack(playerGB);
    expect(mem_1.left.coord).toEqual(null);
    expect(mem_1.right.coord).toEqual('B1');
    expect(mem_1.top.coord).toEqual(null);
    expect(mem_1.bottom.coord).toEqual('A2');

    mem_1.weighOptions(playerGB);
    expect(mem_1.right.weight).toEqual(0);
    expect(mem_1.bottom.weight).toEqual(0);
    expect(mem_1.getMax().coord).toEqual('B1');

    cpu.playerMove('B1');
    mem_1.weighOptions(playerGB);
    expect(mem_1.right.weight).toEqual(-100);
    expect(mem_1.bottom.weight).toEqual(0);
    expect(mem_1.getMax().coord).toEqual('A2');
  });

  test('Find best move function', () => {
    playerGB = Gameboard();
    let testShip = playerGB.createShip(3);
    playerGB.placeShip('B3', testShip);
    cpu = Player(cpuGB, playerGB, true);

    cpu.playerMove('C3');
    let mem_1 = new cpu.cpuMemory('C3');
    mem_1.getCoordsForAttack(playerGB);
    cpu.cpuHits.push(mem_1);
    expect(cpu.cpuHits.length).toBe(1);
    mem_1.weighOptions(playerGB);
    expect(mem_1.left.weight).toEqual(0);
    expect(mem_1.right.weight).toEqual(0);
    expect(mem_1.top.weight).toEqual(0);
    expect(mem_1.bottom.weight).toEqual(0);
    expect(cpu.findBestMove()).toEqual('B3');

    cpu.playerMove('B3');
    let mem_2 = new cpu.cpuMemory('B3');
    mem_2.getCoordsForAttack(playerGB);
    cpu.cpuHits.push(mem_2);
    mem_1.weighOptions(playerGB); //С3
    expect(mem_1.left.weight).toEqual(-100);
    expect(mem_1.right.weight).toEqual(100);
    expect(mem_1.top.weight).toEqual(0);
    expect(mem_1.bottom.weight).toEqual(0);
    mem_2.weighOptions(playerGB); //B3
    expect(mem_2.left.weight).toEqual(100);
    expect(mem_2.right.weight).toEqual(-100);
    expect(mem_2.top.weight).toEqual(0);
    expect(mem_2.bottom.weight).toEqual(0);
    expect(cpu.findBestMove()).toEqual('D3');

    cpu.playerMove('D3');
    let mem_3 = new cpu.cpuMemory('D3');
    mem_3.getCoordsForAttack(playerGB);
    cpu.cpuHits.push(mem_3);

    mem_1.weighOptions(playerGB); //C3
    expect(mem_1.left.weight).toEqual(-100);
    expect(mem_1.right.weight).toEqual(-100);
    expect(mem_1.top.weight).toEqual(-100);
    expect(mem_1.bottom.weight).toEqual(-100);

    mem_2.weighOptions(playerGB); //B3
    expect(mem_2.left.weight).toEqual(-100);
    expect(mem_2.right.weight).toEqual(-100);
    expect(mem_2.top.weight).toEqual(-100);
    expect(mem_2.bottom.weight).toEqual(-100);

    mem_3.weighOptions(playerGB); //D3
    expect(mem_3.left.weight).toEqual(-100);
    expect(mem_3.right.weight).toEqual(-100);
    expect(mem_3.top.weight).toEqual(-100);
    expect(mem_3.bottom.weight).toEqual(-100);

    expect(cpu.findBestMove()).toBeFalsy();
  });
});
