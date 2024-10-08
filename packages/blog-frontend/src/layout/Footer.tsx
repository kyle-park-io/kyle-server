import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';
// image
// import Notion from '/notion-icon.svg?url';
// import Linkedin from '/linkedin-icon.png?url';
// import Github from '/github-icon.png?url';
import Notion from '@public/notion-icon.svg';
import Linkedin from '@public/linkedin-icon.png';
import Github from '@public/github-icon.png';

const Footer: Component = (): JSX.Element => {
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
      <Container fluid>
        <Row class="tw-items-center">
          <Col lg={3} md={3} sm={4} xs={4}></Col>
          <Col
            lg={6}
            md={6}
            sm={4}
            xs={4}
            class="tw-flex tw-justify-center tw-items-center tw-h-8 tw-text-white"
          >
            <footer class="tw-text-xs sm:tw-text-base">
              <span>© 2024 kyle-park-io</span>
            </footer>
          </Col>
          <Col
            lg={3}
            md={3}
            sm={4}
            xs={4}
            class="tw-flex tw-justify-end tw-items-center tw-h-8 tw-gap-1"
          >
            <img
              src={Notion}
              alt="Notion"
              onClick={handleNotionClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
            <img
              src={Linkedin}
              alt="Linkedin"
              onClick={handleLinkedinClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
            <img
              src={Github}
              alt="Github"
              onClick={handleGithubClick}
              class="tw-h-6 tw-cursor-pointer"
            ></img>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Footer;
