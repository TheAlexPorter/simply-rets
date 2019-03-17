import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import GoogleMapReact from 'google-map-react';
import { numberWithCommas } from '../utils';
import { GOOGLE_MAPS_API_KEY } from '../config';
import Footer from './Footer';

const shadow = `box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);`;
const gutter = '10px';
const primary = '#303bf6';

const StyledViewer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  margin-right: ${gutter};
`;

const TitleBar = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  display: flex;
  margin-bottom: ${gutter};
  padding: ${gutter};
  ${shadow}
  border-bottom: ${gutter} solid ${primary}; 
`;

const TitleText = styled.h1`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  margin-right: ${gutter};
`;

const StyledMap = styled.div`
  width: 50%;
  height: 100%;
  position: relative;
  ${shadow}
`;

const StyledMarker = styled.div`
  width: 70px;
  height: 70px;
  color: white;
  background: grey;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  transform: translate(-50%, -50%);
`;

const PhotoContainer = styled.div`
  width: 50%;
  height: 360px;
  ${shadow}
  overflow: hidden;
  margin-right: ${gutter};

  img {
    height: 110%;
  }
`;

const PropertyDetails = styled.div`
  background-color: white;
  display: inline-block;
  /* padding: ${gutter}; */
  margin-right: ${gutter};
  /* ${shadow} */
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${gutter};
`;

const Viewer = ({ property }) => {
  const { address } = property;
  const mapCenter = { lat: property.geo.lat, lng: property.geo.lng };
  const fullAddress = `${address.full}, ${address.city}, ${address.state} ${
    address.postalCode
  }`;

  const Button = styled.button`
    position: relative;
    color: ${primary};
    font-size: 18px;
    font-weight: bold;
    border: 2px solid ${primary};
    margin: 0;
    padding: ${gutter};
    transition: all 0.25s ease-in-out;
    cursor: pointer;

    &:hover {
      color: white;
      background-color: ${primary};
      transform: translateY(-5px);
    }
  `;

  const Address = styled.p`
    margin: 0;
    text-align: right;
  `;

  const TextBody = styled.div`
    display: flex;
    flex-direction: column;
    padding: ${gutter};
    background-color: white;
    ${shadow}
    flex: 1;
    margin-bottom: ${gutter};
  `;

  const Heading = styled.h3`
    margin: 0;
    margin-bottom: 20px;
  `;

  const Paragraph = styled.p`
    margin: 0;
    margin-bottom: 20px;
  `;

  const MapMarker = ({ text }) => <StyledMarker>{text}</StyledMarker>;

  return (
    <StyledViewer>
      <TitleBar>
        <FlexRow>
          <TitleText>${numberWithCommas(property.listPrice)}</TitleText>
          <Address>{fullAddress}</Address>
        </FlexRow>
        <FlexRow>
          <PropertyDetails>
            Beds {property.property.bedrooms} | Baths{' '}
            {property.property.bathsFull} | 1/2 Bath{' '}
            {property.property.bathsHalf} | Sq Ft{' '}
            {numberWithCommas(property.property.area)}
          </PropertyDetails>

          <Button>Contact Agent</Button>
        </FlexRow>
      </TitleBar>

      <FlexRow>
        <PhotoContainer>
          <img src={property.photos[0]} alt='Property' />
        </PhotoContainer>

        <StyledMap>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GOOGLE_MAPS_API_KEY
            }}
            defaultCenter={mapCenter}
            defaultZoom={11}
            center={mapCenter}
          >
            <MapMarker
              lat={property.geo.lat}
              lng={property.geo.lng}
              text={'Property'}
            />
          </GoogleMapReact>
        </StyledMap>
      </FlexRow>

      <TextBody>
        <Heading>Listing description</Heading>
        <Paragraph>
          Activated charcoal hashtag DIY small batch taxidermy. Af edison bulb
          cred sustainable biodiesel try-hard blog. Art party flexitarian 8-bit
          schlitz tofu VHS. Shabby chic ugh umami bitters, twee meh everyday
          carry williamsburg pickled.
        </Paragraph>
        <Paragraph>
          Sriracha skateboard craft beer, blue bottle normcore distillery air
          plant trust fund meditation tacos kinfolk mlkshk. Taiyaki
          farm-to-table hoodie, cronut direct trade gentrify ramps dreamcatcher
          bicycle rights banh mi semiotics yuccie. Taiyaki paleo listicle,
          salvia gastropub yr bicycle rights post-ironic gochujang freegan tote
          bag crucifix vexillologist edison bulb pug. Listicle raclette banh mi
          hella taxidermy, iPhone typewriter. Jean shorts iceland affogato umami
          wayfarers taxidermy kitsch schlitz art party. Meggings whatever
          artisan bitters.
        </Paragraph>
        <Paragraph>
          Cloud bread schlitz tumeric organic, etsy drinking vinegar hammock
          skateboard hella offal. Vinyl cred pour-over readymade jianbing.
          Brunch four dollar toast ennui, dreamcatcher hammock salvia pinterest
          wolf cred hoodie yuccie. Chicharrones heirloom irony marfa tilde synth
          pitchfork kickstarter pork belly woke VHS raw denim flexitarian. Umami
          flexitarian fashion axe intelligentsia hammock pug hashtag cardigan
          polaroid ethical.
        </Paragraph>

        <Footer />
      </TextBody>
    </StyledViewer>
  );
};

Viewer.propTypes = {
  property: PropTypes.object
};

Viewer.defaultProps = {
  center: { lat: 59.95, lng: 30.33 },
  zoom: 11
};
export default Viewer;
