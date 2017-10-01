import createReducer, { EXAMPLE_GENERATOR, resize, toggle, updateProbability } from './index';

describe('reducer', () => {
  const reducer = createReducer({
    n: 5,
    m: 6,
    generator: EXAMPLE_GENERATOR
  });
  let state;

  it('should resize matrix to 3x3', () => {
    state = reducer(undefined, resize(3, 3));
    expect(state.matrix.size[0]).toEqual(3);
    expect(state.matrix.size[1]).toEqual(3);
    expect(state.matrix.groups.size).toEqual(1);
  });

  it('should resize matrix to 5x6', () => {
    state = reducer(state, resize(5, 6));
    expect(state.matrix.size[0]).toEqual(5);
    expect(state.matrix.size[1]).toEqual(6);
    expect(state.matrix.groups.size).toEqual(4);
  });

  it('should count groups', () => {
    expect(state.matrix.islands.toArray()).toEqual([
      [ 1, 0, 0, 0, 2, 0 ],
      [ 1, 1, 0, 0, 0, 3 ],
      [ 0, 0, 0, 0, 0, 0 ],
      [ 0, 0, 0, 0, 0, 4 ],
      [ 0, 0, 0, 0, 0, 4 ]
    ]);
  });

  it('should calculate groups colors', () => {
    expect(state.matrix.colors.toArray()).toEqual([
      [72, 0, 0, 0, 144, 0],
      [72, 72, 0, 0, 0, 216],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 288],
      [0, 0, 0, 0, 0, 288]
    ]);
  });

  it('should correctly count groups', () => {
    expect(Array.from(state.matrix.groups.keys())).toEqual([1, 2, 3, 4]);
    expect(Array.from(state.matrix.groups.values())).toEqual([
      [ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ] ],
      [ [ 0, 4 ] ],
      [ [ 1, 5 ] ],
      [ [ 3, 5 ], [ 4, 5 ] ]
    ]);
  });

  it('should flip cell at 3,1', () => {
    state = reducer(state, toggle(3, 1));
    expect(state.matrix.groups.size).toEqual(5);
  });
  
  it('should update generator\'s probability', () => {
    state = reducer(state, updateProbability(0.3));

    expect(state.history.records.slice(-1)).toEqual([
      {
        id: expect.anything(),
        cellsCount: 30,
        groupsCount: 4,
        probability: 0.3
      }
    ]);
  });
});
