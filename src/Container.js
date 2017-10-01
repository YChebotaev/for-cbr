import React from 'react';

export default ({ children }) => {
  const style = {
    maxWidth: 960,
    margin: 'auto'
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
};
