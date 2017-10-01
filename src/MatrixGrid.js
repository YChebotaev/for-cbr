import React, { PureComponent } from 'react';

class MatrixGrid extends PureComponent {
  render() {
      const { matrix, onChange, colors } = this.props;
      const renderCell = (rowIndex, value, colIndex) => {
        const h = colors[rowIndex][colIndex]
        const groupColor = h === 0 ? 'transparent' : `hsl(${h}, 100%, 50%)`;
        const style = {
          transition: 'background-color 0.2s ease-in',
          backgroundColor: groupColor
        };
        return (
          <td key={colIndex} style={style}>
            <input type="checkbox" defaultChecked={value} onClick={onChange.bind(null, rowIndex, colIndex)} />
          </td>
        );
    };
    const rows = matrix.map((cols, rowIndex) => {
      return (
        <tr key={`${rowIndex}}`}>{cols.map(renderCell.bind(null, rowIndex))}</tr>
      );
    });
    return (
      <table>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

export default MatrixGrid;
