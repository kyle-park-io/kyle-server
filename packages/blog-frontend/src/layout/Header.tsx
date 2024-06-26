import { type Component, type JSX } from 'solid-js';
import { createSignal } from 'solid-js';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import HomeLogo from '/home.svg?url';
// component
import { Move } from '../components/offcanvas/Offcanvas';

const Header: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

  // const navigate = useNavigate();
  const handleTitleClick = (): void => {
    // navigate('/');
    window.location.href = `${url}`;
  };
  const handleImageClick = (): void => {
    // navigate('/');
    window.location.href = `${url}`;
  };
  const handleAboutClick = (): void => {
    // navigate('/about');
    window.location.href = `${url}/about`;
  };

  const [show, setShow] = createSignal(false);
  const handleOpen = (): void => {
    setShow(true);
  };
  const handleClose = (): void => {
    setShow(false);
  };

  return (
    <>
      <div>
        <header class="offscreen">golang is forever !</header>
        <Container fluid>
          <Row class="tw-items-center">
            <Col lg={3} md={3} sm={4} xs={4} class="tw-flex tw-justify-start">
              <button onClick={handleImageClick} class="transparent tw-h-10">
                <img src={HomeLogo} alt="Home" class="tw-h-full"></img>
              </button>
            </Col>
            <Col lg={6} md={6} sm={4} xs={4} class="tw-flex tw-justify-center">
              <button onClick={handleTitleClick} class="transparent">
                <span>KYLE PARK</span>
              </button>
            </Col>
            <Col lg={3} md={3} sm={4} xs={4} class="tw-flex tw-justify-end">
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
