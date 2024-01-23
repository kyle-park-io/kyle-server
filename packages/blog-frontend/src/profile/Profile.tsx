import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';

const Profile: Component = (): JSX.Element => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>Profile</h1>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <span>body</span>
          </Col>
          <Col md={4}>image</Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
