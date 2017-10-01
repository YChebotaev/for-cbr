import React from 'react';
import { connect } from 'react-redux';
import Grid from 'material-ui/Grid';
import { toggle } from './reducer';
import MatrixGrid from './MatrixGrid';
import HistoryTable from './HistoryTable';
import MatrixConfig from './MatrixConfig';
import Container from './Container';

const mapStateToProps = state => {
  return {
    matrix: state.matrix.value.toArray(),
    matrixId: state.matrix.id,
    colors: state.matrix.colors.toArray(),
    groups: Array.from(state.matrix.groups),
    history: state.history.records
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  toggle(n, m) {
    dispatch(toggle(n, m));
  }
});

export const App = ({ matrix, matrixId, colors, groups, history, toggle }) => {
  return (
    <Container>
      <Grid container direction="column" align="center">
        <Grid item align="center" xs={12}>
          <MatrixConfig />
        </Grid>
        <Grid item align="center" xs={12}>
          <MatrixGrid matrix={ matrix } colors={ colors } onChange={toggle} key={ matrixId } />
          <div>Доменов: {groups.length}</div>
        </Grid>
        <Grid item xs={12}>
          <HistoryTable items={history} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
