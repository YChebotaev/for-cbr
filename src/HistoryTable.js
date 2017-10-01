import React from 'react';
import Table, { TableHead, TableBody, TableRow, TableCell } from 'material-ui/Table';

export default ({ items }) => {
  return (
    <Table>
      <TableHead>
        <tr>
          <th>Вероятность</th>
          <th>Количество доменов в матрице</th>
          <th>Количество ячеек в матрице (N*M)</th>
        </tr>
      </TableHead>
      <TableBody>
        {
          items.map(({ cellsCount, groupsCount, id, probability }) => (
            <TableRow key={id}>
              <TableCell numeric>{Math.round(probability * 100)}%</TableCell>
              <TableCell numeric>{groupsCount}</TableCell>
              <TableCell numeric>{cellsCount}</TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  );
};
