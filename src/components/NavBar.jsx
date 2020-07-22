import React, { Component } from 'react';

class NavBar extends Component {

    //stateless functional component

    shouldComponentUpdate(){
        return false;
    }

    render() {
        return (
            <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
                <ul className="navbar-nav">
                    <li className="nav-item active">
                        <h2 style={{color: 'white'}} align='center'>PathFinder</h2>
                    </li>
                    {/* <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Link</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled" href="#">Disabled</a>
                    </li> */}
                </ul>
            </nav>
        );
    }
}

export default NavBar;
