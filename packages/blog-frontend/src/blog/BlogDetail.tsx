import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { useParams, useNavigate } from '@solidjs/router';
import axios from 'axios';
import { Spinner, Container, Row, Col, Form } from 'solid-bootstrap';
import { globalState } from '../constants/constants';

const BlogDetail: Component = (): JSX.Element => {
  const api_url = globalState.api_url;

  const params = useParams();
  const navigate = useNavigate();

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  // const [title, setTitle] = createSignal('');
  const [htmlContent, setHtmlContent] = createSignal('');

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog/${params.id}`);
        if (!res.data.exist) {
          navigate(`/blog/not-found?id=${params.id}`);
        }

        // setTitle(res.data.title);
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
        <Row class="tw-h-full tw-flex tw-flex-col">
          <Col md={12}>
            <h1>BlogDetail</h1>
            <br></br>
          </Col>
          <div class="tw-flex-1 tw-flex">
            <Col md={2} xs={0}></Col>
            <Col
              md={8}
              xs={12}
              class="tw-h-full tw-flex tw-justify-center tw-items-center"
            >
              {!loading() ? (
                <>
                  <span>Loading...</span>
                  <Spinner animation="border" variant="primary" />
                </>
              ) : (
                <>
                  {error() !== null ? (
                    <span>{error()?.message}</span>
                  ) : (
                    <>
                      <Row class="tw-w-full tw-h-full">
                        <Col md={8} xs={12}>
                          {/* {title() !== '' && (
                            <div
                              style="white-space: pre-wrap;"
                              innerHTML={title()}
                            />
                          )} */}
                          {htmlContent() !== '' && (
                            <div
                              style="white-space: pre-wrap;"
                              innerHTML={htmlContent()}
                            />
                          )}
                        </Col>
                        <Col
                          md={4}
                          xs={0}
                          class="tw-hidden tw-h-full md:tw-flex"
                        >
                          <textarea
                            class="tw-h-full tw-w-full tw-border tw-rounded"
                            placeholder="자유롭게 메모하세요"
                          ></textarea>
                        </Col>
                      </Row>
                    </>
                  )}
                </>
              )}
            </Col>
            <Col md={2} xs={0}></Col>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default BlogDetail;
