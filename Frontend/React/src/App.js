import logo from './logo.svg';
import React, { useState, setState } from 'react';
import './App.css';
import DataMap from './components/DataMap.jsx';
import Title from './components/Title.jsx';

class App extends React.Component {
    state = {
      jsonReturnedValue: [],
    }

  componentDidMount() {
    fetch('https://tranquil-earth-06116.herokuapp.com/https://backend-hex.herokuapp.com/')
          .then(response => response.json())
          .then(data => {this.setState({ jsonReturnedValue: data})})
          .catch(err => {console.log(err);});
  };

  render () {
    return(
      <div className="App">
      <Title />
      <DataMap jsonReturnedValue={this.state.jsonReturnedValue}/>
      </div>
    )
  };
}

export default App;
