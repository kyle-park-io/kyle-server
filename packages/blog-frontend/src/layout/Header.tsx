import { type Component, type JSX } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import HomeLogo from '/home.svg?url';
// component
import { Move } from '../components/offcanvas/Offcanvas';

const Header: Component = (): JSX.Element => {
  const navigate = useNavigate();
  const handleTitleClick = (): void => {
    navigate('/');
  };
  const handleImageClick = (): void => {
    navigate('/');
  };
  const handleAboutClick = (): void => {
    navigate('/about');
  };
  const [show, setShow] = createSignal(false);
  const handleOpen = (): void => {
    setShow(true);
  };

  const handleClose = (): void => {
    setShow(false);
  };

  createEffect(() => {
    // console.log(show());
    // setShow(props.open);
  });

  return (
    <>
      <div>
        <header class="offscreen">golang is forever !</header>
        <Container fluid>
          <Row class="tw-items-center">
            <Col md={3} class="tw-flex tw-justify-start">
              <button onClick={handleImageClick} class="transparent tw-h-10">
                <img src={HomeLogo} alt="Home" class="tw-h-full"></img>
              </button>
            </Col>
            <Col md={6} class="tw-flex tw-justify-center">
              <button onClick={handleTitleClick} class="transparent">
                <span>KYLE PARK</span>
              </button>
            </Col>
            <Col md={3} class="tw-flex tw-justify-end">
              <Nav defaultActiveKey="#" as="ul">
                <Nav.Item as="li">
                  <Nav.Link eventKey="about" onClick={handleAboutClick}>
                    <span class="tw-text-black">About</span>
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link eventKey="move" onClick={handleOpen}>
                    <span class="tw-text-black">Move</span>
                  </Nav.Link>
                  <Move show={show()} onHide={handleClose}></Move>
                </Nav.Item>
              </Nav>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default Header;
