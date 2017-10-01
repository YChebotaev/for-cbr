import math from 'mathjs';
import shortid from 'shortid';

export const DEFAULT_KERNEL = [[-1, 0], [0, -1], [1, 0], [0, 1]];

export const RANDOM_GENERATOR = {
  probability: 0.5,
  generate() {
    return Math.random() <= this.probability ? 1 : 0
  }
};

export const ZERO_GENERATOR = {
  probability: 0,
  generate() {
    return 0;
  }
};

export const EXAMPLE_GENERATOR = {
  probability: 0.2,
  generate([ni, mi], n, m) {
    // 0 0
    // 0 4
    // 1 0
    // 1 1
    // 1 5
    // 3 5
    // 4 5
    if (ni <= 5 && mi <= 6) {
      return [
        [1, 0, 0, 0, 1, 0],
        [1, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 1]
      ][ni][mi];
    } else {
      return 0;
    }
  }
};

const generateValue = (generator, ...args) => generator.generate(...args);

const createMatrix = (n, m, generator = ZERO_GENERATOR) => {
  const array = new Array(n);
  for (let ni = 0; ni < n; ni++) {
    array[ni] = new Array(m);
    for (let mi = 0; mi < m; mi++) {
      array[ni][mi] = generateValue(generator, [ni, mi], n, m);
    }
  }
  return math.sparse(array, 'number');
};

const isInBounds = ([nSize, jSize], [ni, nj]) => {
  return ni >= 0 && ni < nSize && nj >= 0 && nj < jSize;
};

function* kernelIterator(matrix, baseIndex, kernel) {
  const matrixSize = matrix.size();
  for (let kernelIndex of kernel) {
    const index = math.add(baseIndex, kernelIndex);
    if (isInBounds(matrixSize, index)) {
      yield index;
    }
  }
}

function* distinctColors(size) {
  const step = 360 / size;
  for (let i=0; i<size; i++) {
    yield step * i; // H of HSL
  }
};

const createIslands = matrix => {
  const [n, m] = matrix.size();
  return math.zeros(n, m, 'sparse');
};

const createColorsMap = size => {
  const map = new Map();
  for (let color of distinctColors(size + 1)) {
    map.set(map.size, color);
  }
  return map;
};

const markIslands = (matrix, kernel) => {
  const groups = new Map();
  const islands = createIslands(matrix);
  const kernelIndices = index => kernelIterator(matrix, index, kernel);

  const isVisited = index => !!islands.get(index);

  const visitCell = (index, groupId, group) => {
    group.push(index);
    islands.set(index, groupId);
    for (let kernelIndex of kernelIndices(index)) {
      if (!isVisited(kernelIndex) && matrix.get(kernelIndex)) {
        visitCell(kernelIndex, groupId, group);
      }
    }
  };

  let groupId = 0;
  matrix.forEach((value, index) => {
    if (value && !isVisited(index)) {
      const group = [];
      groupId += 1;
      visitCell(index, groupId, group);
      groups.set(groupId, group);
    }
  });

  const colorsMap = createColorsMap(groups.size);
  const colors = islands.map(value => colorsMap.get(value));

  return {
    matrix,
    islands,
    groups,
    colors
  };
};

const pushCapped = (array, item, limit) => {
  array = array.concat(item);
  return array.length > limit ? array.slice(-limit) : array;
};

export const ACTION_MATRIX_RESIZE = 'MATRIX//RESIZE';
export const ACTION_MATRIX_AUTOFILL = 'MATRIX//AUTOFILL';
export const ACTION_MATRIX_CELLFLIP = 'MATRIX//CELLFLIP';
export const ACTION_MATRIX_UPDATEPROBABILITY = 'MATRIX//UPDATEPROBABILITY';

export const resize = (n, m) => {
  return {
    type: ACTION_MATRIX_RESIZE,
    payload: [ n, m ]
  };
};

export const toggle = (n, m) => {
  return {
    type: ACTION_MATRIX_CELLFLIP,
    payload: { index: [n, m] }
  };
};

export const updateProbability = (value) => {
  return {
    type: ACTION_MATRIX_UPDATEPROBABILITY,
    payload: value
  };
};

export const autofill = (n, m) => {
  return {
    type: ACTION_MATRIX_AUTOFILL,
    payload: { size: [n, m] }
  };
};

export const createReducer = (initialState) => {
  const value = createMatrix(initialState.n, initialState.m, initialState.generator);
  const { islands, groups, colors } = markIslands(value, DEFAULT_KERNEL);
  const matrixReducerInitialState = {
      value,
      islands,
      groups,
      colors,
      id: shortid.generate(),
      size: [initialState.n, initialState.m],
      kernel: DEFAULT_KERNEL,
      generator: initialState.generator
  };
  const historyReducerInitialState = { records: [] };
  const rootReducerInitialState = {
    matrix: matrixReducerInitialState,
    history: historyReducerInitialState
  };

  const rootReducer = (state = rootReducerInitialState, action) => {
    if (state == null) {
      const matrix = matrixReducer(state.matrix, action);
      state = {
        matrix,
        history: historyReducer(state.history, Object.assign({}, action, {
          payload: Object.assign({}, action.payload, {
            probability: matrix.generator.probability,
            groupsCount: matrix.groups.size,
            cellsCount: matrix.size[0] * matrix.size[1]
          })
        }))
      };
    }
    switch (action.type) {
      case ACTION_MATRIX_CELLFLIP:
      case ACTION_MATRIX_UPDATEPROBABILITY:
      case ACTION_MATRIX_RESIZE:
      case ACTION_MATRIX_AUTOFILL:
        const matrix = matrixReducer(state.matrix, action);
        return {
          matrix,
          history: historyReducer(state.history, Object.assign({}, action, {
            payload: Object.assign({}, action.payload, {
              probability: matrix.generator.probability,
              groupsCount: matrix.groups.size,
              cellsCount: matrix.size[0] * state.matrix.size[1]
            })
          }))
        }
      default:
        return state;
    }
  };
  
  const matrixReducer = (state = matrixReducerInitialState, action) => {
    let value, size;
    switch (action.type) {
      case ACTION_MATRIX_CELLFLIP: {
        value = state.value.clone().set(action.payload.index, 1 - state.value.get(action.payload.index))
        const { islands, groups, colors } = markIslands(value, DEFAULT_KERNEL);
        return Object.assign({}, state, {
          value,
          islands,
          groups,
          colors
        });
      }
      case ACTION_MATRIX_UPDATEPROBABILITY:
        state = Object.assign({}, state, {
          generator: Object.assign({}, state.generator, {
            probability: action.payload
          })
        });
        size = state.size;
        value = createMatrix(state.size[0], state.size[1], state.generator);
        // eslint-disable-line no-fallthrough
      case ACTION_MATRIX_AUTOFILL:
        size = size || state.size;
        // eslint-disable-line no-fallthrough
      case ACTION_MATRIX_RESIZE: {
        size = size || action.payload;
        value = value || createMatrix(size[0], size[1], state.generator);
        let { islands, groups, colors } = markIslands(value, DEFAULT_KERNEL);
        return Object.assign({}, state, {
          id: shortid.generate(),
          value,
          islands,
          groups,
          colors,
          size
        });
      }
      default:
        return state;
    }
  };

  const historyReducer = (state = historyReducerInitialState, action) => {
    switch (action.type) {
      case ACTION_MATRIX_CELLFLIP:
      case ACTION_MATRIX_UPDATEPROBABILITY:
      case ACTION_MATRIX_AUTOFILL:
      case ACTION_MATRIX_RESIZE:
        return Object.assign({}, state, {
          records: pushCapped(state.records, {
            id: shortid.generate(),
            probability: action.payload.probability,
            groupsCount: action.payload.groupsCount,
            cellsCount: action.payload.cellsCount
          }, 10)
        });
      default:
        return state;
    }
  };

  return rootReducer;
};

export default createReducer;
