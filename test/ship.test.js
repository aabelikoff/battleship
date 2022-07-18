import Ship from '../src/Ship';

describe('Ship: factory', () => {
  let results = [];
  let length;

  beforeEach(() => {
    results = [];
    for (length = 1; length <= 4; length++) {
      results.push(Ship(length));
    }
  });

  test('is Ship factory defined', () => {
    expect(Ship).toBeDefined();
  });

  test('has length property', () => {
    expect(results[0]).toHaveProperty('length');
    expect(results[1]).toHaveProperty('length');
    expect(results[2]).toHaveProperty('length');
    expect(results[3]).toHaveProperty('length');
  });

  test('length property value', () => {
    expect(results[0].length).toBe(1);
    expect(results[1].length).toBe(2);
    expect(results[2].length).toBe(3);
    expect(results[3].length).toBe(4);
  });

  test('has hit method', () => {
    expect(results[0].hit).toBeDefined();
    expect(results[1].hit).toBeDefined();
    expect(results[2].hit).toBeDefined();
    expect(results[3].hit).toBeDefined();
  });

  test('has isSunc method', () => {
    expect(results[0].isSunc).toBeDefined();
    expect(results[1].isSunc).toBeDefined();
    expect(results[2].isSunc).toBeDefined();
    expect(results[3].isSunc).toBeDefined();
  });

  test('isSunc and hit method proper work', () => {
    expect(results[3].isSunc()).toBeFalsy();
    for (let i = 0; i < results[3].length; i++) {
      results[3].hit();
    }
    expect(results[3].isSunc()).toBeTruthy();

    expect(results[2].isSunc()).toBeFalsy();
    for (let i = 0; i < results[2].length; i++) {
      results[2].hit();
    }
    expect(results[2].isSunc()).toBeTruthy();

    expect(results[0].isSunc()).toBeFalsy();
    for (let i = 0; i < results[0].length; i++) {
      results[0].hit();
    }
    expect(results[0].isSunc()).toBeTruthy();

    expect(results[1].isSunc()).toBeFalsy();
    for (let i = 0; i < results[1].length; i++) {
      results[1].hit();
    }
    expect(results[1].isSunc()).toBeTruthy();
  });

  test('isSunc and hit method proper work', () => {
    expect(results[3].isSunc()).toBeFalsy();
    expect(results[2].isSunc()).toBeFalsy();
    expect(results[1].isSunc()).toBeFalsy();
    expect(results[0].isSunc()).toBeFalsy();

    results.forEach((result) => {
      result.hit();
    });
    expect(results[3].isSunc()).toBeFalsy();
    expect(results[2].isSunc()).toBeFalsy();
    expect(results[1].isSunc()).toBeFalsy();
    expect(results[0].isSunc()).toBeTruthy();

    results.forEach((result) => {
      result.hit();
    });
    expect(results[3].isSunc()).toBeFalsy();
    expect(results[2].isSunc()).toBeFalsy();
    expect(results[1].isSunc()).toBeTruthy();
    expect(results[0].isSunc()).toBeTruthy();

    results.forEach((result) => {
      result.hit();
    });
    expect(results[3].isSunc()).toBeFalsy();
    expect(results[2].isSunc()).toBeTruthy();
    expect(results[1].isSunc()).toBeTruthy();
    expect(results[0].isSunc()).toBeTruthy();

    results.forEach((result) => {
      result.hit();
    });
    expect(results[3].isSunc()).toBeTruthy();
    expect(results[2].isSunc()).toBeTruthy();
    expect(results[1].isSunc()).toBeTruthy();
    expect(results[0].isSunc()).toBeTruthy();
  });
});
