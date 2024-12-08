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
  ChainCard,
  WeddingCard,
  DistributedCard,
  JunghoCard,
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
  const handleDistributedClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Distributed-Computing-1315e2b1051680f3bc8ee9f38bbd18a3';
  };
  const handleChainClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Chain-Communicator-08fe9b295ed34662b4a72e70a608f937';
  };
  const handleJunghoClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/jungho-dev-03cc176ddcdb496a969cacaeec0c253f';
  };
  const handleWeddingClick = (): void => {
    window.location.href =
      'https://kyle-park.notion.site/Cardly-Mobile-Wedding-Invitation-519b87bb3c534155ae7d1da51bc89478';
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
            lg={12}
            md={12}
            sm={12}
            xs={12}
            class="tw-flex tw-justify-start tw-gap-4"
          >
            <Row class="tw-items-center tw-w-full">
              <Col lg={2} md={2} sm={2} xs={2}>
                <button onClick={handleDexClick} class="transparent">
                  <DexCard></DexCard>
                </button>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <button onClick={handleDistributedClick} class="transparent">
                  <DistributedCard></DistributedCard>
                </button>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <button onClick={handleChainClick} class="transparent">
                  <ChainCard></ChainCard>
                </button>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <button onClick={handleJunghoClick} class="transparent">
                  <JunghoCard></JunghoCard>
                </button>
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                <button onClick={handleWeddingClick} class="transparent">
                  <WeddingCard></WeddingCard>
                </button>
              </Col>
            </Row>
          </Col>
          {/* <Col lg={5} md={5} sm={0} xs={0}></Col> */}
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
