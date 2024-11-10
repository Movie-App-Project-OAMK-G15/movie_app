import { Link } from 'react-router-dom';
import '../styles/Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/screenings">Movie screenings</Link></li>
        <li><Link to="/search">Browse movies</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
