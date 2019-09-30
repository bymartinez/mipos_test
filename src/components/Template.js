import React from 'react';
import { Navbar, Container, Row, Col } from 'react-bootstrap';
import PropTypes from 'prop-types';
import '../styles.css';

const Template = ({ children }) => (
  <>
    <Navbar bg="dark" variant="dark" style={{ marginBottom: 10 }}>
      <Container>
        <Row style={{ width:'100%' }}>
          <Col className='text-center' xs={6} lg={6} md={6}>
            <p className='title-text'>Apertura de Caja</p>
          </Col>
          <Col className='text-center' xs={6} lg={6} md={6}>
            <p className='title-text'>Cierre de Caja</p>
          </Col>
        </Row>
      </Container>
    </Navbar>
    {children}
  </>
);

Template.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Template;
