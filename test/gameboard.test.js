import Gameboard from '../src/gameboard';

describe('Testing Gameboard factory', () => {
  let g;

  beforeEach(() => {
    g = Gameboard();
  });

  test('Is Gameboard factory defined', () => {
    expect(Gameboard).toBeDefined();
  });

  test('Detect coordinates method defined', () => {
    expect(g.detectCoordinates).toBeDefined();
  });

  test('Detect coordinates method works', () => {
    expect(g.detectCoordinates('A10')).toEqual({
      letter: 'A',
      digit: 10,
    });
  });

  test('Detect coordinates method  works with inproper values', () => {
    expect(g.detectCoordinates('X10')).toBeUndefined();
  });

  test('Is enough place for ship method', () => {
    expect(g.isEnoughPlace).toBeDefined();
    expect(g.isEnoughPlace('G1', 4, true)).toBeTruthy();
    expect(g.isEnoughPlace('H1', 4, true)).toBeFalsy();
    expect(g.isEnoughPlace('B7', 4, false)).toBeTruthy();
    expect(g.isEnoughPlace('B8', 4, false)).toBeFalsy();
    expect(g.isEnoughPlace('J10', 1, false)).toBeTruthy();
    expect(g.isEnoughPlace('J10', 1, true)).toBeTruthy();
    expect(g.isEnoughPlace('J1', 1, true)).toBeTruthy();
    expect(g.isEnoughPlace('I1', 2, true)).toBeTruthy();
    expect(g.isEnoughPlace('J9', 3, false)).toBeFalsy();
    expect(g.isEnoughPlace('I9', 3, true)).toBeFalsy();
    expect(g.isEnoughPlace('A9', 3, false)).toBeFalsy();
    expect(g.isEnoughPlace('E10', 2, false)).toBeFalsy();
  });

  test('Create ship coordinatese array', () => {
    expect(g.createShipCoordinates).toBeDefined();
    expect(g.createShipCoordinates('A1', 4)).toStrictEqual([
      'A1',
      'B1',
      'C1',
      'D1',
    ]);
    expect(g.createShipCoordinates('A1', 4, false)).toStrictEqual([
      'A1',
      'A2',
      'A3',
      'A4',
    ]);
    expect(g.createShipCoordinates('J1', 1)).toStrictEqual(['J1']);
    expect(g.createShipCoordinates('E10', 1, false)).toStrictEqual(['E10']);
  });

  test('Create ship method', () => {
    expect(g.createShip).toBeDefined();
    expect(g.createShip(2).length).toBe(2);
    expect(g.createShip(4).isSunc).toBeDefined();
    expect(g.createShip(1).hit).toBeDefined();
    expect(g.shipContainer.length).toBe(3);
  });

  test('Place ship method', () => {
    expect(g.placeShip).toBeDefined();
    let ship = g.createShip(4);
    expect(ship.length).toBe(4);
    expect(g.placeShip('J1', ship)).toBeFalsy();
    g.placeShip('A1', ship, true);
    expect(ship.coordinates).toEqual(['A1', 'B1', 'C1', 'D1']);
    g.placeShip('G7', ship, false);
    expect(ship.coordinates).toEqual(['G7', 'G8', 'G9', 'G10']);
    let ship_1 = g.createShip(2);
    expect(g.placeShip('E7', ship_1)).toBeFalsy();
    expect(g.placeShip('H6', ship_1, false)).toBeFalsy();
    g.placeShip('I10', ship_1);
    expect(ship_1.coordinates).toEqual(['I10', 'J10']);
  });

  test('Find ship coord method', () => {
    expect(g.findShipCoord('B4')).toBeFalsy();
    g.placeShip('B4', g.createShip(4));
    expect(g.findShipCoord('B3')).toBeFalsy();
    expect(g.findShipCoord('C5')).toBeFalsy();
    expect(g.findShipCoord('D3')).toBeFalsy();
    expect(g.findShipCoord('F4')).toBeFalsy();
    expect(g.findShipCoord('B4')).toBeTruthy();
    expect(g.findShipCoord('C4')).toBeTruthy();
    expect(g.findShipCoord('D4')).toBeTruthy();
    expect(g.findShipCoord('E4')).toBeTruthy();
  });

  test('Find ship by coordinates method', () => {
    let testShip_1 = g.createShip(2);
    let testShip_2 = g.createShip(3);
    g.placeShip('A1', testShip_1);
    g.placeShip('J1', testShip_2, false);

    expect(g.findShipByCoord('A1')).toStrictEqual(testShip_1);
    expect(g.findShipByCoord('B1')).toStrictEqual(testShip_1);

    expect(g.findShipByCoord('J1')).toStrictEqual(testShip_2);
    expect(g.findShipByCoord('J2')).toStrictEqual(testShip_2);
    expect(g.findShipByCoord('J3')).toStrictEqual(testShip_2);

    expect(g.findShipByCoord('J10')).toBeUndefined();
    expect(g.findShipByCoord('J10')).toBeFalsy();
  });

  test('Find fields to verify method', () => {
    expect(g.findFieldsToVerify).toBeDefined();
    expect(g.findFieldsToVerify('A1')).toEqual(['A1', 'A2', 'B1', 'B2']);
    expect(g.findFieldsToVerify('E1')).toEqual([
      'D1',
      'D2',
      'E1',
      'E2',
      'F1',
      'F2',
    ]);
    expect(g.findFieldsToVerify('J1')).toEqual(['I1', 'I2', 'J1', 'J2']);
    expect(g.findFieldsToVerify('A5')).toEqual([
      'A4',
      'A5',
      'A6',
      'B4',
      'B5',
      'B6',
    ]);
    expect(g.findFieldsToVerify('E5')).toEqual([
      'D4',
      'D5',
      'D6',
      'E4',
      'E5',
      'E6',
      'F4',
      'F5',
      'F6',
    ]);
    expect(g.findFieldsToVerify('J5')).toEqual([
      'I4',
      'I5',
      'I6',
      'J4',
      'J5',
      'J6',
    ]);
    expect(g.findFieldsToVerify('A10')).toEqual(['A9', 'A10', 'B9', 'B10']);
    expect(g.findFieldsToVerify('E10')).toEqual([
      'D9',
      'D10',
      'E9',
      'E10',
      'F9',
      'F10',
    ]);
    expect(g.findFieldsToVerify('J10')).toEqual(['I9', 'I10', 'J9', 'J10']);
  });

  test('Is close ship', () => {
    let ship = g.createShip(4);
    g.placeShip('B2', ship, false);
    expect(g.isCloseShip('B2')).toBeTruthy();
    expect(g.isCloseShip('A1')).toBeTruthy();
    expect(g.isCloseShip('B6')).toBeTruthy();
    expect(g.isCloseShip('C1')).toBeTruthy();
    expect(g.isCloseShip('C6')).toBeTruthy();
    expect(g.isCloseShip('C3')).toBeTruthy();

    expect(g.isCloseShip('D2')).toBeFalsy();
    expect(g.isCloseShip('A7')).toBeFalsy();
    expect(g.isCloseShip('B7')).toBeFalsy();
  });

  test('Check for close ships', () => {
    let ship = g.createShip(4);
    g.placeShip('E2', ship);
    expect(g.checkForCloseShips('C2', 2)).toBeTruthy();
    expect(g.checkForCloseShips('F1', 3)).toBeTruthy();
    expect(g.checkForCloseShips('A2', 2)).toBeFalsy();
  });

  test('Hit attack method', () => {
    let test_ship = g.createShip(4);
    g.placeShip('B4', test_ship);

    expect(g.missedAttacks.length).toBe(0);
    expect(g.hits.length).toBe(0);

    expect(g.hitAttack('A1')).toBeTruthy();
    expect(g.hitAttack('A1')).toBeFalsy();
    expect(g.field.A[0]).toEqual('miss');
    expect(g.missedAttacks.length).toBe(1);
    expect(g.missedAttacks[0]).toEqual('A1');

    expect(g.hitAttack('B4')).toBeTruthy();
    expect(g.hitAttack('B4')).toBeFalsy();
    expect(g.field.B[3]).toEqual('hit');
    expect(g.hits.length).toEqual(1);
    expect(g.hits[0]).toEqual('B4');

    expect(g.hitAttack('C4')).toBeTruthy();
    expect(g.hitAttack('C4')).toBeFalsy();
    expect(g.field.C[3]).toEqual('hit');
    expect(g.hits.length).toEqual(2);
    expect(g.hits[1]).toEqual('C4');

    expect(g.hitAttack('D4')).toBeTruthy();
    expect(g.hitAttack('D4')).toBeFalsy();
    expect(g.field.D[3]).toEqual('hit');
    expect(g.hits.length).toEqual(3);
    expect(g.hits[2]).toEqual('D4');

    // g = Gameboard();
    // g.createAllShips();
    // g.randomPlaceShips();
    // let initCode = 'A'.charCodeAt(0);
    // let c;
    // for (let i = 0; i < 10; i++) {
    //   c = String.fromCharCode(initCode + i);
    //   for (let k = 1; k < 11; k++) {
    //     g.hitAttack(c + k);
    //   }
    // }
    // expect(g.shipContainer.length).toBe(10);
    // expect(g.hits.length + g.missedAttacks.length).toBe(100);
    // expect(g.hits.length).toBe(20);
  });

  test('All ships sunk', () => {
    let testShip_1 = g.createShip(1);
    let testShip_2 = g.createShip(2);

    g.placeShip('A1', testShip_1);
    g.placeShip('A3', testShip_2);
    expect(g.shipContainer.length).toBe(2);

    expect(g.allShipsSunk()).toBeFalsy();

    g.hitAttack('A1');
    expect(g.allShipsSunk()).toBeFalsy();

    g.hitAttack('A3');
    expect(g.allShipsSunk()).toBeFalsy();

    g.hitAttack('B3');
    expect(g.allShipsSunk()).toBeTruthy();
  });

  test('Random place ships & create ships', () => {
    g.createAllShips();
    expect(g.shipContainer.length).toBe(10);
    expect(g.randomPlaceShips()).toBeUndefined();
    expect(g.shipContainer[0].length).toBe(4);
    expect(g.shipContainer[1].length).toBe(3);
    expect(g.shipContainer[2].length).toBe(3);
    expect(g.shipContainer[3].length).toBe(2);
    expect(g.shipContainer[4].length).toBe(2);
    expect(g.shipContainer[5].length).toBe(2);
    expect(g.shipContainer[6].length).toBe(1);
    expect(g.shipContainer[7].length).toBe(1);
    expect(g.shipContainer[8].length).toBe(1);
    expect(g.shipContainer[9].length).toBe(1);

    expect(g.shipContainer[0]).toHaveProperty('coordinates');
    expect(g.shipContainer[1]).toHaveProperty('coordinates');
    expect(g.shipContainer[2]).toHaveProperty('coordinates');
    expect(g.shipContainer[3]).toHaveProperty('coordinates');
    expect(g.shipContainer[4]).toHaveProperty('coordinates');
    expect(g.shipContainer[5]).toHaveProperty('coordinates');
    expect(g.shipContainer[6]).toHaveProperty('coordinates');
    expect(g.shipContainer[7]).toHaveProperty('coordinates');
    expect(g.shipContainer[8]).toHaveProperty('coordinates');
    expect(g.shipContainer[9]).toHaveProperty('coordinates');

    expect(g.shipContainer[0].coordinates.length).toBe(4);
    expect(g.shipContainer[1].coordinates.length).toBe(3);
    expect(g.shipContainer[2].coordinates.length).toBe(3);
    expect(g.shipContainer[3].coordinates.length).toBe(2);
    expect(g.shipContainer[4].coordinates.length).toBe(2);
    expect(g.shipContainer[5].coordinates.length).toBe(2);
    expect(g.shipContainer[6].coordinates.length).toBe(1);
    expect(g.shipContainer[7].coordinates.length).toBe(1);
    expect(g.shipContainer[8].coordinates.length).toBe(1);
    expect(g.shipContainer[9].coordinates.length).toBe(1);

    expect(g.shipContainer[0]).toHaveProperty('horisontal');
    expect(g.shipContainer[1]).toHaveProperty('horisontal');
    expect(g.shipContainer[2]).toHaveProperty('horisontal');
    expect(g.shipContainer[3]).toHaveProperty('horisontal');
    expect(g.shipContainer[4]).toHaveProperty('horisontal');
    expect(g.shipContainer[5]).toHaveProperty('horisontal');
    expect(g.shipContainer[6]).toHaveProperty('horisontal');
    expect(g.shipContainer[7]).toHaveProperty('horisontal');
    expect(g.shipContainer[8]).toHaveProperty('horisontal');
    expect(g.shipContainer[9]).toHaveProperty('horisontal');
  });

  test('Rotate ship', () => {
    let test_ship_4 = g.createShip(4);
    let test_ship_2 = g.createShip(2);
    g.placeShip('A1', test_ship_4);
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'B1', 'C1', 'D1']);
    g.rotateShip(test_ship_4);
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'A2', 'A3', 'A4']);
    expect(test_ship_4.horisontal).toBeFalsy();
    g.rotateShip(test_ship_4);
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'B1', 'C1', 'D1']);
    g.placeShip('A3', test_ship_2, false);
    g.rotateShip(test_ship_4);
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'B1', 'C1', 'D1']);
  });

  test('Rotate ship by coord', () => {
    let test_ship_4 = g.createShip(4);
    let test_ship_2 = g.createShip(2);
    g.placeShip('A1', test_ship_4);
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'B1', 'C1', 'D1']);
    g.rotateShipCoord('B1');
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'A2', 'A3', 'A4']);
    g.rotateShipCoord('A4');
    expect(test_ship_4.coordinates).toStrictEqual(['A1', 'B1', 'C1', 'D1']);
  });

  test('Move ship', () => {
    let testShip = g.createShip(2);
    g.placeShip('B2', testShip);
    g.moveShip(testShip, 'A1');
    expect(testShip.coordinates).toStrictEqual(['A1', 'B1']);
  });
});

describe('Testing field property of Gameboard', () => {
  let g;

  beforeEach(() => {
    g = Gameboard();
  });

  test('Arrays are exist', () => {
    expect(g.field.A.length).toBe(10);
    expect(g.field.B.length).toBe(10);
    expect(g.field.C.length).toBe(10);
    expect(g.field.D.length).toBe(10);
    expect(g.field.E.length).toBe(10);
    expect(g.field.F.length).toBe(10);
    expect(g.field.G.length).toBe(10);
    expect(g.field.H.length).toBe(10);
    expect(g.field.I.length).toBe(10);
    expect(g.field.J.length).toBe(10);
  });
});
//
