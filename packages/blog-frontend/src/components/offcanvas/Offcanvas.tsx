import { type Component, type JSX } from 'solid-js';
import { createEffect } from 'solid-js';
import { Offcanvas, ListGroup } from 'solid-bootstrap';
// interface
import { type MoveProps } from './interfaces/offcanvas.interfaces';

export const Move: Component<MoveProps> = (props): JSX.Element => {
  const env = import.meta.env.VITE_ENV;
  let url;
  if (env === 'DEV') {
    url = import.meta.env.VITE_DEV_URL;
  } else if (env === 'PROD') {
    url = import.meta.env.VITE_PROD_URL;
  } else {
    throw new Error('url env error');
  }

  const handleDexClick = (): void => {
    window.location.href = `${url}/dex`;
  };
  const handleNotionClick = (): void => {
    window.open(
      'https://www.notion.so/kyle-park/c92ee6d25f1f48fe8fa54ef5fa79790c',
    );
  };
  const handleLinkedinClick = (): void => {
    window.open('https://www.linkedin.com/in/kyle-park-io');
  };
  const handleGithubClick = (): void => {
    window.open('https://github.com/kyle-park-io');
  };

  createEffect(() => {
    console.log(props.show);
  });

  return (
    <>
      <div>
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
              <ListGroup.Item
                onClick={handleDexClick}
                class="tw-cursor-pointer"
              >
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
      </div>
    </>
  );
};
