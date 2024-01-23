import { type Component, type JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col } from 'solid-bootstrap';

// component
import Hero from '../hero/Hero';

// card
import {
  ProfileCard,
  LinkdeinCard,
  GithubCard,
  DexCard,
  BlogCard,
  ChatCard,
} from '../components/card/Card';

const App: Component = (): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

  const navigate = useNavigate();
  const handleProfileClick = (): void => {
    navigate('/profile');
  };
  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };
  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };
  const handleDexClick = (): void => {
    window.location.href = `${url}/dex`;
  };
  const handleBlogClick = (): void => {
    navigate('/blog');
  };
  const handleChatClick = (): void => {
    navigate('/chat');
  };

  return (
    <>
      <Hero></Hero>
      <Container fluid>
        <Row class="tw-items-center">
          <Col md={5}></Col>
          <Col md={7}>
            <h1>Introduce</h1>
          </Col>
          <Col md={5}></Col>
          <Col md={7} class="tw-flex tw-justify-start tw-gap-4">
            <button onClick={handleProfileClick} class="transparent">
              <ProfileCard></ProfileCard>
            </button>
            <button onClick={handleLinkedinClick} class="transparent">
              <LinkdeinCard></LinkdeinCard>
            </button>
            <button onClick={handleGithubClick} class="transparent">
              <GithubCard></GithubCard>
            </button>
          </Col>
        </Row>
        <Row class="tw-items-center">
          <Col md={7}>
            <h1>Project</h1>
          </Col>
          <Col md={5}></Col>
          <Col md={7} class="tw-flex tw-justify-start tw-gap-4">
            <button onClick={handleDexClick} class="transparent">
              <DexCard></DexCard>
            </button>
          </Col>
          <Col md={5}></Col>
        </Row>
        <Row class="tw-items-center">
          <Col md={5}></Col>
          <Col md={7}>
            <h1>Extra</h1>
          </Col>
          <Col md={5}></Col>
          <Col md={7} class="tw-flex tw-justify-start tw-gap-4">
            <button onClick={handleBlogClick} class="transparent">
              <BlogCard></BlogCard>
            </button>
            <button onClick={handleChatClick} class="transparent">
              <ChatCard></ChatCard>
            </button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
