import { type Component, type JSX } from 'solid-js';
import { Offcanvas, ListGroup } from 'solid-bootstrap';
// interface
import { type MoveProps } from './interfaces/offcanvas.interfaces';
import { globalState } from '../../constants/constants';

export const Move: Component<MoveProps> = (props): JSX.Element => {
  const url = globalState.url;

  const handleDexClick = (): void => {
    window.location.href = `${url}/dex`;
  };
  const handleNotionClick = (): void => {
    window.open(
      'https://kyle-park.notion.site/HI-I-m-KYLE-c52ac7c7e75c41dd92792f9db8cee895#0cbc2dce44ad44cba1e679d7ca4519c6',
    );
  };
  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };
  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };

  return (
    <>
      <Offcanvas
        show={props.show}
        onHide={props.onHide}
        placement={'end'}
        scroll={true}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Link</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ListGroup>
            <ListGroup.Item onClick={handleDexClick} class="tw-cursor-pointer">
              DEX
            </ListGroup.Item>
            <ListGroup.Item
              onClick={handleNotionClick}
              class="tw-cursor-pointer"
            >
              NOTION
            </ListGroup.Item>
            <ListGroup.Item
              onClick={handleLinkedinClick}
              class="tw-cursor-pointer"
            >
              LINKEDIN
            </ListGroup.Item>
            <ListGroup.Item
              onClick={handleGithubClick}
              class="tw-cursor-pointer"
            >
              GITHUB
            </ListGroup.Item>
          </ListGroup>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
