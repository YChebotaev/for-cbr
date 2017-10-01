import React from 'react';
import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import NumberInput from './NumberInput';
import { resize, updateProbability, autofill } from './reducer';

const mapStateToProps = state => {
  return {
    n: state.matrix.size[0],
    m: state.matrix.size[1],
  }
};

const mapDispatchToProps = dispatch => {
  return {
    resize(n, m, event) {
      const value = Number(event.target.value);
      if (n == null) {
        n = value;
      } else
      if (m == null) {
        m = value;
      }
      dispatch(resize(n, m));
    },
    setProbability(event) {
      const value = Number(event.target.value);
      dispatch(updateProbability(value));
    },
    autofill(n, m) {
      dispatch(autofill(n, m));
    }
  };
};

const MatrixConfig = ({ n, m, resize, setProbability, autofill }) => {
  return [
    // <input key={0} placeholder="width" type="number" defaultValue={n} onChange={resize.bind(this, n, null)} />,
    <NumberInput
      key={0}
      placeholder="Width"
      type="number"
      defaultValue={n}
      min={1}
      max={99}
      onChange={resize.bind(this, n, null)} />,
    // <input key={1} placeholder="height" type="number" defaultValue={m} onChange={resize.bind(this, null, m)} />,
    <NumberInput
      key={1}
      placeholder="Height"
      type="number"
      defaultValue={m}
      min={1}
      max={99}
      onChange={resize.bind(this, null, m)} />,
    <NumberInput
      key={2}
      placeholder="Probability"
      type="number"
      defaultValue={0.5}
      min={0.01}
      max={0.99}
      step={0.01}
      onChange={setProbability} />,
    <Button key={3} onClick={autofill.bind(this, n, m)}>Auto</Button>
  ];
};

export default connect(mapStateToProps, mapDispatchToProps)(MatrixConfig);