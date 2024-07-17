import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import axios from 'axios';
import { Spinner, Container, Row, Col } from 'solid-bootstrap';
import { globalState } from '../constants/constants';

const BlogDetail: Component = (): JSX.Element => {
  const api_url = globalState.api_url;

  const params = useParams();
  const navigate = useNavigate();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [title, setTitle] = createSignal('');
  const [htmlContent, setHtmlContent] = createSignal('');

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog/${params.id}`);
        if (!res.data.exist) {
          navigate(`/blog/not-found?id=${params.id}`);
        }

        setTitle(res.data.title);
        setHtmlContent(res.data.detail);
        setLoading(true);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
        setLoading(true);
      }
    }
    void fetchData();
  });

  return (
    <>
      <Container fluid class="tw-p-4">
        <Row>
          <Col md={12}>
            <h1>BlogDetail</h1>
          </Col>
          <Col md={2}></Col>
          <Col md={8} class="tw-flex tw-justify-center">
            {!loading() ? (
              <div>
                <span>Loading...</span>
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <div>
                {error() !== null ? (
                  <span>{error()?.message}</span>
                ) : (
                  <div>
                    {title() !== '' && (
                      <div style="white-space: pre-wrap;" innerHTML={title()} />
                    )}
                    {htmlContent() !== '' && (
                      <div
                        style="white-space: pre-wrap;"
                        innerHTML={htmlContent()}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col md={2}></Col>
        </Row>
      </Container>
    </>
  );
};

export default BlogDetail;
