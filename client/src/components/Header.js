import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>Veegil Media Banking App</h1>
    </header>
  );
};

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '10px',
};

const titleStyle = {
  fontSize: '24px',
};

export default Header;
