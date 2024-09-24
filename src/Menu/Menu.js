import { Link } from "react-router-dom"; // Importing Link component

function Menu() {
    return (
    <nav>
        <ul>
            <li><Link to="/">Homepage</Link></li>
            <li><Link to="/about" title="Learn more about the company">About</Link></li> 
            <li><Link to="/login" title="Login to access member-only content">Login</Link></li> 
        </ul>
    </nav>
    );
}

export default Menu;
