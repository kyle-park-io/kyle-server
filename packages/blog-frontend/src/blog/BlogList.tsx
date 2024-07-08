import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { A } from '@solidjs/router';
import { Button } from 'solid-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import {
  Spinner,
  Container,
  Row,
  Col,
  Pagination,
  Table,
} from 'solid-bootstrap';
import { globalState } from '../constants/constants';

const BlogList: Component = (): JSX.Element => {
  const api_url = globalState.api_url;

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal(['']);

  const handleClick = (): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        await axios.get(`${api_url}/api/blog/update`);
        window.location.reload();
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    }
    void handleAsyncClick();
  };

  const handleButtonClick = (id: string): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog/download/${id}`, {
          responseType: 'blob',
        });
        const blob = new Blob([res.data], {
          type: res.headers['content-type'],
        });
        saveAs(blob, `${id}.md`);
      } catch (err) {
        if (err instanceof Error) {
          setError(err);
        } else {
          setError(new Error(String(err)));
        }
      }
    }
    void handleAsyncClick();
  };

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get(`${api_url}/api/blog`);
        setList(res.data);
        setLoading(true);

        const res2 = await axios.get(`${api_url}/api/blog/number`);
        console.log(res2);
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
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>BlogList</h1>
          </Col>
        </Row>
        <Row>
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
                    <div>
                      <button
                        onClick={handleClick}
                        class="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
                      >
                        Update
                      </button>
                    </div>
                    <div>
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Head</th>
                          </tr>
                        </thead>
                        <For each={list()}>
                          {(item, index) => (
                            <tr>
                              <td>{index() + 1}</td>
                              <td>
                                <A href={'/blog' + '/' + item}>{item}</A>
                              </td>
                              <td>
                                <Button
                                  onClick={() => handleButtonClick(item)}
                                  variant="info"
                                >
                                  Download
                                </Button>
                              </td>
                            </tr>
                          )}
                        </For>
                      </Table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Col>
          <Col md={2}></Col>
          <Col md={12} class="tw-flex tw-items-center tw-justify-center">
            <Pagination size="sm">
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item>{1}</Pagination.Item>
              <Pagination.Ellipsis />

              <Pagination.Item>{10}</Pagination.Item>
              <Pagination.Item>{11}</Pagination.Item>
              <Pagination.Item active>{12}</Pagination.Item>
              <Pagination.Item>{13}</Pagination.Item>
              <Pagination.Item disabled>{14}</Pagination.Item>

              <Pagination.Ellipsis />
              <Pagination.Item>{20}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BlogList;
