import styled, { css } from 'styled-components';

export const Property = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  padding: 5px;
  background-image: ${props => `url('${props.background}')`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  max-width: 360px;
  height: 220px;
  margin-bottom: 20px;
  color: white;
  font-family: 'Overpass', sans-serif;
`;

export const Price = styled.h1`
  margin: 0;
  text-align: right;
  font-size: 30px;
  font-weight: bold;
  line-height: 32px;
  text-shadow: 1px 1px 0 #353535;
`;
