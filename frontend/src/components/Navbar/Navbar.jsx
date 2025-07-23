import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Главная</Link>
      <Link to="/about">О филиале</Link>
    </nav>
  );
}
export default Navbar;