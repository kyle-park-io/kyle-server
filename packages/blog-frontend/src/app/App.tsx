import { type Component, type JSX } from 'solid-js';
import { createEffect } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Container, Row, Col } from 'solid-bootstrap';
// component
import Hero from '../hero/Hero';
// card
import {
  imageLoading,
  ProfileCard,
  LinkdeinCard,
  GithubCard,
  DexCard,
  BlogCard,
  ChatCard,
} from '../components/card/Card';
import { globalState } from '../constants/constants';

const App: Component = (): JSX.Element => {
  const url = globalState.url;

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

  createEffect(() => {
    console.log(imageLoading);
  });

  return (
    <>
      <Hero></Hero>
      <Container fluid class="tw-p-4">
        <Row class="tw-items-center">
          <Col lg={5} md={5} sm={0} xs={0}></Col>
          <Col lg={7} md={7} sm={12} xs={12}>
            <h1>Introduce</h1>
          </Col>
          <Col lg={5} md={5} sm={0} xs={0}></Col>
          <Col
            lg={7}
            md={7}
            sm={12}
            xs={12}
            class="tw-flex tw-justify-start tw-gap-4"
          >
            <Row class="tw-items-center tw-w-full">
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleProfileClick} class="transparent">
                  <ProfileCard></ProfileCard>
                </button>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleLinkedinClick} class="transparent">
                  <LinkdeinCard></LinkdeinCard>
                </button>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleGithubClick} class="transparent">
                  <GithubCard></GithubCard>
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row class="tw-items-center">
          <Col lg={7} md={7} sm={12} xs={12}>
            <h1>Project</h1>
          </Col>
          <Col lg={5} md={5} sm={0} xs={0}></Col>
          <Col
            lg={7}
            md={7}
            sm={12}
            xs={12}
            class="tw-flex tw-justify-start tw-gap-4"
          >
            <Row class="tw-items-center tw-w-full">
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleDexClick} class="transparent">
                  <DexCard></DexCard>
                </button>
              </Col>
            </Row>
          </Col>
          <Col lg={5} md={5} sm={0} xs={0}></Col>
        </Row>
        <Row class="tw-items-center">
          <Col lg={5} md={5} sm={0} xs={0}></Col>
          <Col lg={7} md={7} sm={12} xs={12}>
            <h1>Extra</h1>
          </Col>
          <Col lg={5} md={5} sm={0} xs={0}></Col>
          <Col
            lg={7}
            md={7}
            sm={12}
            xs={12}
            class="tw-flex tw-justify-start tw-gap-4"
          >
            <Row class="tw-items-center tw-w-full">
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleBlogClick} class="transparent">
                  <BlogCard></BlogCard>
                </button>
              </Col>
              <Col lg={4} md={4} sm={4} xs={4}>
                <button onClick={handleChatClick} class="transparent">
                  <ChatCard></ChatCard>
                </button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
