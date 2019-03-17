import React, { Component } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import find from 'lodash/find';
import fire from '../firebase';
import { numberWithCommas, isEven } from '../utils';
import bathIcon from '../images/shower.svg';
import halfBathIcon from '../images/sink.svg';
import bedIcon from '../images/bed.svg';

const StyledScrollbars = styled.div`
  width: 50%;
  height: calc(100vh - 30px);
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const PropertyWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  background-color: white;
  padding: 5px 0;
  /* width: 50%; */
  /* padding: 5px; */
  /* height: calc(100vh - 15px); */
  /* height: 60vh; */
  /* overflow-y: scroll; */
`;

const StyledProperty = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-image: ${props => `url('${props.background}')`};
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: calc(50% - 15px);
  height: 220px;
  margin: 5px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  cursor: pointer;

  &:last-of-type(:nth-of-type(odd)) {
    margin-right: auto;
  }

  &:hover {
    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    background-color: rgba(0, 0, 0, 40%);
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: all 0.15s ease-in-out;
    z-index: 0;
  }

  & > * {
    z-index: 1;
  }
`;

const HomeIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  width: 30px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  z-index: 5;

  &:hover svg {
    transform: translateY(-5px);
  }

  svg {
    position: relative;
    fill: ${props => (props.saved ? '#ff4e4e' : 'white')};
    stroke: ${props => (props.saved ? '#ff1e1e' : 'white')};
    stroke-width: 5px;
    transition: all 0.15s ease-in-out;
  }
`;

const LargeText = styled.h1`
  color: white;
  text-align: right;
  font-size: 25px;
  font-weight: bold;
  line-height: 30px;
  margin: 0;
`;

const MediumText = styled.h1`
  color: white;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
`;

const DetailText = styled.h1`
  color: white;
  font-size: 12px;
  font-weight: bold;
  margin: 0;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-of-type) {
    margin-right: 15px;
  }

  span {
    display: block;
    color: white;
    font-size: 16px;
    font-weight: bold;
    margin: 0;
    margin-right: 5px;
    cursor: pointer;
  }
`;

const TopDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 5px;
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

const DetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: auto;
  padding: 5px;
`;

const DetailIcon = styled.div`
  width: 25px;

  img {
    width: 100%;
  }
`;

class Properties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: '',
      properties: [],
      savedProperties: []
    };
    this.getProperties = this.getProperties.bind(this);
    this.getSavedProperties = this.getSavedProperties.bind(this);
  }

  componentDidMount() {
    this.getUserId();
    this.getSavedProperties();
    this.getProperties();
  }

  getUserId = () => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      this.generateUserId();
      return;
    }
    this.setState({ userID });
  };

  generateUserId = () => {
    const newUserID = Math.floor(Math.random() * 10904071935);
    localStorage.setItem('userID', newUserID);
  };

  async getProperties() {
    const response = await axios.get(
      'https://api.simplyrets.com/properties?limit=11',
      {
        auth: {
          username: 'simplyrets',
          password: 'simplyrets'
        }
      }
    );

    this.setState({ properties: response.data }, () =>
      this.props.selectedProperty(this.state.properties[0])
    );
  }

  async getSavedProperties() {
    const db = fire.database().ref(`/${this.state.userID}`);
    await db.once('value').then(snapshot => {
      const data = snapshot.val();
      let savedProperties = [];

      if (data && data[this.state.userID]) {
        savedProperties = Object.keys(data[this.state.userID]).map(val => {
          return { mlsId: data[this.state.userID][val], firebase: val };
        });
      }

      if (data && !data[this.state.userID]) {
        savedProperties = Object.keys(data).map(val => {
          return {
            mlsId: data[val],
            firebase: val
          };
        });
      }
      this.setState({ savedProperties });
      return savedProperties;
    });
  }

  deleteSavedProperty = mlsId => {
    const deleted = find(this.state.savedProperties, { mlsId });
    fire
      .database()
      .ref(this.state.userID)
      .child('' + deleted.firebase)
      .remove();
  };

  getSavedStatus = (mlsId, id) => {
    const { savedProperties } = this.state;
    const found = find(savedProperties, { mlsId });
    return savedProperties.includes(found);
  };

  saveProperty = (e, id) => {
    e.stopPropagation();
    const { userID, properties, savedProperties } = this.state;
    const mlsId = properties[id].mlsId;
    const existingProperty = find(savedProperties, { mlsId });

    if (savedProperties.includes(existingProperty)) {
      const newProperties = savedProperties.filter(
        property => property.mlsId !== mlsId
      );

      this.setState({ savedProperties: newProperties });
      this.deleteSavedProperty(mlsId);
      return;
    } else {
      fire
        .database()
        .ref(userID)
        .push(mlsId)
        .then(this.getSavedProperties())
        .catch(err => {
          console.log('firebase error', err);
        });
    }
  };

  alignLastItem = id => {
    if (this.state.properties.length - 1 === id && isEven(id)) {
      return true;
    }
    return false;
  };

  render() {
    const { properties } = this.state;
    return (
      <StyledScrollbars>
        <Scrollbars
          hideTracksWhenNotNeeded
          // autoHide
        >
          <PropertyWrapper>
            {properties.map((property, id) => (
              <StyledProperty
                background={property.photos[0]}
                key={property.mlsId}
                onClick={() => this.props.selectedProperty(property)}
                style={
                  this.alignLastItem(id)
                    ? { marginRight: 'auto', marginLeft: 10 }
                    : {}
                }
              >
                <HomeIcon
                  saved={this.getSavedStatus(property.mlsId, id)}
                  onClick={e => this.saveProperty(e, id)}
                >
                  <svg
                    version='1.1'
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 258.024 258.024'
                    enableBackground='new 0 0 258.024 258.024'
                  >
                    <g>
                      <path d='m18.658,83.255l89.496-67.487 89.496,67.487c1.262,0.952 2.741,1.412 4.209,1.412 2.122,0 4.218-0.961 5.594-2.786 2.328-3.087 1.712-7.476-1.375-9.804l-93.71-70.666c-2.494-1.882-5.935-1.882-8.429,0l-93.709,70.666c-3.087,2.328-3.702,6.717-1.375,9.804 2.327,3.086 6.716,3.701 9.803,1.374z' />
                      <path d='m242.561,187.24c8.572-10.605 10.421-24.974 4.824-37.5-5.523-12.362-16.804-20.147-30.174-20.825-0.683-0.035-1.371-0.053-2.063-0.053-2.14,0-4.234,0.187-6.284,0.511v-21.899c0-2.197-1.031-4.266-2.786-5.589l-93.71-70.666c-2.494-1.882-5.935-1.882-8.429,0l-93.71,70.666c-1.754,1.323-2.786,3.392-2.786,5.589v118.977c0,3.866 3.134,7 7,7h144.354l17.761,21.973c1.329,1.644 3.33,2.6 5.444,2.6s4.115-0.956 5.444-2.6l19.818-24.518c0.002-0.002 0.003-0.004 0.005-0.006l35.292-43.66zm-221.117-76.276l86.71-65.387 86.71,65.387v23.43c-5.115,3.009-9.519,7.105-12.862,11.988-7.239-10.57-19.396-17.519-33.147-17.519-0.692,0-1.379,0.018-2.061,0.052-13.372,0.678-24.653,8.463-30.176,20.825-5.596,12.525-3.748,26.895 4.825,37.5l26.038,32.212h-126.037v-108.488zm110.887,67.475c-5.244-6.488-6.367-15.296-2.93-22.988 3.331-7.455 10.099-12.148 18.105-12.554 0.447-0.022 0.897-0.034 1.35-0.034 14.417,0 26.147,11.729 26.147,26.147 0,3.866 3.134,7 7,7s7-3.134 7-7c0-14.417 11.729-26.147 26.146-26.147 0.453,0 0.903,0.012 1.352,0.035 8.005,0.406 14.772,5.099 18.103,12.554 3.437,7.692 2.314,16.5-2.93,22.988l-49.671,61.45-49.672-61.451z' />
                    </g>
                  </svg>
                </HomeIcon>
                <TopDetails>
                  <MediumText>MLS #{property.mlsId}</MediumText>
                  <DetailText>
                    {format(property.listDate, 'MM/DD/YYYY')}
                  </DetailText>
                </TopDetails>
                <DetailsBox>
                  <FlexRow>
                    <LargeText>
                      ${numberWithCommas(property.listPrice)}
                    </LargeText>
                  </FlexRow>
                  <FlexRow>
                    <DetailItem
                      data-tip={`${property.property.bathsFull} baths`}
                    >
                      <ReactTooltip place='top' type='light' effect='solid' />
                      <span>{property.property.bathsFull}</span>
                      <DetailIcon>
                        <img src={bathIcon} alt='Bath' />
                      </DetailIcon>
                    </DetailItem>

                    <DetailItem
                      data-tip={`${property.property.bathsHalf} half baths`}
                    >
                      <ReactTooltip place='top' type='light' effect='solid' />
                      <span>{property.property.bathsHalf}</span>
                      <DetailIcon>
                        <img src={halfBathIcon} alt='1/2 Bath' />
                      </DetailIcon>
                    </DetailItem>

                    <DetailItem
                      data-tip={`${property.property.stories} floors`}
                    >
                      <ReactTooltip place='top' type='light' effect='solid' />
                      <span>{property.property.stories} flrs</span>
                    </DetailItem>

                    <DetailItem
                      data-tip={`${property.property.bedrooms} bedrooms`}
                    >
                      <ReactTooltip place='top' type='light' effect='solid' />
                      <span>{property.property.bedrooms}</span>
                      <DetailIcon>
                        <img src={bedIcon} alt='Bedrooms' />
                      </DetailIcon>
                    </DetailItem>
                  </FlexRow>
                </DetailsBox>
              </StyledProperty>
            ))}
          </PropertyWrapper>
        </Scrollbars>
      </StyledScrollbars>
    );
  }
}

export default Properties;
