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
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>{blogId} not exist</h1>
          </Col>
          <Col md={12}>
            <Button onClick={handleButtonClick} variant="info">
              Go To Homepage
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BlogNotFound;
