import React, { Component } from 'react'
import { GoogleApiWrapper } from 'google-maps-react'
import './App.css';
import Map from './Map'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {menuShow: false}
    this.menuClick = this.menuClick.bind(this)
  }

  // Changes the menuShow state
  menuClick() {
    this.setState(prevState => ({
      menuShow: !prevState.menuShow
    }))
  }

  // Calls menuClick on KeyPress event.
  menuKey = (event) => {
    if(event.key === "Enter"){
      this.menuClick();
    }
  }

  render() {
    return (
      <div className="app">
        <header className="app-header">
          <a onClick={this.menuClick} onKeyPress={this.menuKey} className="hamburger-menu" tabIndex="0" role="button" aria-label="Location menu">
            <div className="hamburger"></div>
            <div className="hamburger"></div>
            <div className="hamburger"></div>
          </a>
          <h1 className="app-title">Tasty cakes in Derry</h1>
        </header>
        <main>
          <Map
            google={this.props.google}
            menuShow={this.state.menuShow}
          />
        </main>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBxS1r-NrIn9q7M8KSQclueVgMm6LfQEiE'
})(App)
