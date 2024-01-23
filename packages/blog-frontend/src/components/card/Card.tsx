import { type Component, type JSX } from 'solid-js';
import { Card } from 'solid-bootstrap';
// image
import Profile from '/profile-bg.jpg?url';
import Linkedin from '/linkedin-bg.jpg?url';
import Github from '/github-bg.jpg?url';
import Dex from '/defi-bg.jpg?url';
import Blog from '/blog-bg.jpg?url';
import Chat from '/chat-bg.jpg?url';

import './Card.css';

export const ProfileCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Profile} style={{ height: '20rem' }} />
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
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Linkedin} style={{ height: '20rem' }} />
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
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Github} style={{ height: '20rem' }} />
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
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Dex} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>DEX</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};

export const BlogCard: Component = (): JSX.Element => {
  return (
    <>
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Blog} style={{ height: '20rem' }} />
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
      <Card style={{ width: '16rem', height: '25rem' }}>
        <Card.Img variant="top" src={Chat} style={{ height: '20rem' }} />
        <Card.Body class="tw-text-black">
          <Card.Title>ANONYMOUS CHAT</Card.Title>
        </Card.Body>
      </Card>
    </>
  );
};
