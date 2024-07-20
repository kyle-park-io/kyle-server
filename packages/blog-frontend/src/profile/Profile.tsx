import { type Component, type JSX } from 'solid-js';
import { Container, Row, Col, Image } from 'solid-bootstrap';
// image
// import Kyle from '/kyle-bg.webp?url';
import Kyle from '@public/kyle/kyle-bg.webp';

const Profile: Component = (): JSX.Element => {
  return (
    <>
      <Container fluid class="tw-p-4">
        <Row>
          <Col md={12}>
            <h1>Profile</h1>
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md={7} xs={12}>
            <h3 id="-">학력</h3>
            <p>경희대학교 공과대학 기계공학과 졸업 (2014.03 ~ 2022.08)</p>
            <br></br>
            <h3 id="-">경력</h3>
            <ol>
              <li>
                ㈜ 미디움
                <ol>
                  <li>기간 : 2022.09 ~ 2024.02 (18 개월)</li>
                  <li>직급 : 코어팀 · 매니저 2년차</li>
                  <li>업무 : 블록체인</li>
                </ol>
              </li>
              <br></br>
              <li>
                ㈜ 비에프랩스
                <ol>
                  <li>기간 : 2022.08 ~ 2022.09 (2 개월)</li>
                  <li>직급 : 개발팀 · 사원 1년차</li>
                  <li>업무 : 블록체인</li>
                </ol>
              </li>
            </ol>
            <br></br>
            <h3 id="-">자기소개서 (경력 기술서)</h3>
            <p>
              <a href="https://www.notion.so/f3ea582e4db84ad3b256b4f153349d02?pvs=21">
                https://kyle-park.notion.site/f3ea582e4db84ad3b256b4f153349d02?pvs=25
              </a>
            </p>
            <br></br>
            <h3 id="-">포트폴리오</h3>
            <ol>
              <li>
                개인프로젝트
                <br />
                <a href="https://www.notion.so/Portfolio-a69711e7a8484ec08821c84199900e37?pvs=21">
                  https://kyle-park.notion.site/Portfolio-a69711e7a8484ec08821c84199900e37?pvs=4
                </a>
              </li>
              <li>
                기술 문서
                <br />
                <a href="https://www.notion.so/c92ee6d25f1f48fe8fa54ef5fa79790c?pvs=21">
                  https://kyle-park.notion.site/c92ee6d25f1f48fe8fa54ef5fa79790c?pvs=74
                </a>
              </li>
            </ol>
            <br></br>
            <h3 id="-">자격/어학/수상</h3>
            <p>2021 공조냉동기계기사</p>
            <p>2020 일반기계기사</p>
            <p>2021 TOEIC Speaking Test / 150 (intermediate High)</p>
            <p>2019 컴퓨터활용능력 1급</p>
            <p>2005 워드프로세서 1급</p>
            <p>2015 1종 보통운전면허</p>
            <br></br>
            <h3 id="mbti">MBTI</h3>
            <p>ENTJ</p>
          </Col>
          <Col md={5} xs={12}>
            <Image src={Kyle} fluid class="d-none d-md-block"></Image>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
