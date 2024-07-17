import { type Component, type JSX } from 'solid-js';
import { useSearchParams, useNavigate } from '@solidjs/router';
import { Container, Row, Col, Button } from 'solid-bootstrap';

const BlogNotFound: Component = (): JSX.Element => {
  const [searchParams] = useSearchParams();
  const blogId = searchParams.id;

  const navigate = useNavigate();

  const handleButtonClick = (): void => {
    navigate('/');
  };

  return (
    <>
      <Container fluid class="tw-p-4">
        <Row class="tw-h-full tw-flex tw-flex-col">
          <Col md={12}>
            <h1>{blogId} not exist</h1>
            <br></br>
          </Col>
          <Col md={12} class="tw-flex-1">
            <div class="tw-flex tw-justify-center tw-items-center tw-h-full">
              <Button onClick={handleButtonClick} variant="info">
                Go To Homepage
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BlogNotFound;
