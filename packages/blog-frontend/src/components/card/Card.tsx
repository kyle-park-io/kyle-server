import { type Component, type JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Card } from 'solid-bootstrap';
// image
// import Profile from '/profile-bg.jpg?url';
// import Linkedin from '/linkedin-bg.jpg?url';
// import Github from '/github-bg.jpg?url';
// import Dex from '/defi-bg.jpg?url';
// import Blog from '/blog-bg.jpg?url';
// import Chat from '/chat-bg.jpg?url';
import Profile from '@public/profile-bg.jpg';
import Linkedin from '@public/linkedin-bg.jpg';
import Github from '@public/github-bg.jpg';
import Dex from '@public/defi-bg.jpg';
import Distributed from '@public/distributed-bg.jpg';
import Chain from '@public/chain-bg.jpg';
import Jungho from '@public/kyle-b-bg.webp';
import Wedding from '@public/wedding-bg.jpg';
import Blog from '@public/blog-bg.jpg';
import Chat from '@public/chat-bg.jpg';
// css
import './Card.css';

export const [imageLoading, setImageLoading] = createStore({ num: 0 });

const handleImageLoading = (): void => {
  const num = imageLoading.num;
  setImageLoading({ num: num + 1 });
};

export const ProfileCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Profile}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>PROFILE</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const LinkdeinCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Linkedin}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>LINKEDIN</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const GithubCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Github}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>GITHUB</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const DexCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Dex}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>DEX</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const DistributedCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Distributed}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>DISTRIBUTED COMPUTING</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const ChainCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Chain}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>CHAIN COMMUNICATOR</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const JunghoCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Jungho}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>JUNGHO.DEV</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const WeddingCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Wedding}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>Cardly</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const BlogCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Blog}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>BLOG</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const ChatCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '100%', height: '25rem' }}>
        <Card.Img
          variant="top"
          src={Chat}
          style={{ height: '20rem' }}
          onLoad={handleImageLoading}
        />
        <Card.Body class="tw-text-black">
          <Card.Title>ANONYMOUS CHAT</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};
