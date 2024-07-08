import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col, Image } from 'solid-bootstrap';
// image
// import Cat from '/cat-bg.jpg?url';
import Cat from '@public/cat-bg.jpg';

const About: Component = (): JSX.Element => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>About</h1>
          </Col>
        </Row>
        <Row>
          <Col md={7} xs={6}>
            <ol>
              <li>
                <p>
                  본 사이트는 오케스트레이션 연습 및 개인 프로젝트들을
                  업로드하기 위해 구축되었습니다.
                </p>
              </li>
              <li>
                <p>
                  관련된 코드, 개발 문서 등은 얼마든지 참고 및 공유가 가능하니,
                  이를 통해 지속적인 추가 개발이 이루어지기를 희망합니다.
                </p>
              </li>
              <li>
                <p>본 사이트에 적용된 기술 및 개발 언어는 다음과 같습니다.</p>
                <ul>
                  <li>GKE (GCP)</li>
                  <li>Kubenetes</li>
                  <li>Docker</li>
                  <li>
                    Go
                    <ul>
                      <li>
                        Backend
                        <ul>
                          <li>net/http</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    Typescript (NodeJS)
                    <ul>
                      <li>
                        Backend
                        <ul>
                          <li>ExpressJS</li>
                        </ul>
                      </li>
                      <li>
                        Frontend
                        <ul>
                          <li>SolidJS</li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                </ul>
                <br />
              </li>
              <li>
                <p>
                  개인 프로젝트들의 기술 구성은 각 프로젝트 About 을 참고하시기
                  바랍니다.
                </p>
              </li>
              <li>
                <p>
                  기술에 대한 자유로운 의견 공유는 언제나 환영합니다. 다음의
                  방법을 활용해주세요!
                </p>
                <ul>
                  <li>E-mail : andy3638@naver.com</li>
                  <li>
                    LinkedIn :{' '}
                    <a href="https://www.linkedin.com/in/kyle-park-io">
                      https://www.linkedin.com/in/kyle-park-io
                    </a>
                  </li>
                  <li>
                    Github :{' '}
                    <a href="https://github.com/kyle-park-io">
                      https://github.com/kyle-park-io
                    </a>
                  </li>
                  <li>
                    OpenChat :{' '}
                    <a href="https://open.kakao.com/o/s11ostzg">
                      https://open.kakao.com/o/s11ostzg
                    </a>
                  </li>
                </ul>
              </li>
            </ol>
          </Col>
          <Col md={5} xs={6}>
            <Image src={Cat} fluid></Image>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default About;
