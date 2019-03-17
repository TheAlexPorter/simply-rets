import React, { Component } from 'react';
import styled from 'styled-components';
import Properties from './components/Properties';
import Viewer from './components/Viewer';

const Body = styled.div`
  background: #ececec;
  background: -webkit-linear-gradient(bottom right, #ececec, #f3f3f3);
  background: -moz-linear-gradient(bottom right, #ececec, #f3f3f3);
  background: linear-gradient(bottom right, #ececec, #f3f3f3);
  min-height: 100vh;
  font-family: 'Overpass', sans-serif;
  color: #282828;
`;

const StyledApp = styled.div`
  max-width: 1920px;
  margin: 0 auto;
  display: flex;
  border-top: 5px solid #3842f7;
  padding-top: 10px;
`;

class App extends Component {
  constructor() {
    super();
    this.state = {
      selectedProperty: null
    };
  }

  selectedProperty = property => {
    this.setState({ selectedProperty: property });
  };

  render() {
    const { selectedProperty } = this.state;
    return (
      <Body>
        <StyledApp>
          <Properties selectedProperty={this.selectedProperty} />
          {selectedProperty && <Viewer property={selectedProperty} />}
        </StyledApp>
      </Body>
    );
  }
}

export default App;
