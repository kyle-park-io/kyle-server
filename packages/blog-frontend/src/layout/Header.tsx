import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { Container, Row, Col, Nav } from 'solid-bootstrap';
import axios from 'axios';
// image
// import HomeLogo from '/home.svg?url';
import HomeLogo from '@public/home.svg';
// component
import { Move } from '../components/offcanvas/Offcanvas';
import { globalState } from '../constants/constants';

const Header: Component = (): JSX.Element => {
  const url = globalState.url;
  const ingressURL = globalState.ingress_reverse_proxy_url;
  const ingressWebsocketURL = globalState.ingress_reverse_proxy_websocket_url;

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

  const [count, setCount] = createSignal(0);

  onMount(() => {
    // wss://jungho.dev/ws
    const ws = new WebSocket(`${ingressWebsocketURL}/ws`);

    ws.onopen = () => console.log('WebSocket 연결됨');
    ws.onmessage = (event) => {
      const data = event.data.trim();
      const number = parseInt(data, 10);
      setCount(number);
    };
    ws.onclose = () => console.log('WebSocket 연결 종료됨');

    // async function realTimeUser(): Promise<void> {
    //   const res = await axios.get(`${ingressURL}/redis-tcp/real`);
    //   setCount(res.data);
    // }
    // void realTimeUser();
  });

  return (
    <>
      <div class="tw-h-full">
        <header class="offscreen">golang is forever !</header>
        <Container fluid class="tw-h-full">
          <Row class="tw-h-full tw-items-center">
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
              <Nav defaultActiveKey="#" as="ul" class="tw-flex-nowrap">
                <Nav.Item as="li">
                  <Nav.Link eventKey="count" class="tw-cursor-default">
                    <span class="tw-text-black">
                      실시간 접속자 수: {count()}
                    </span>
                  </Nav.Link>
                </Nav.Item>
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
