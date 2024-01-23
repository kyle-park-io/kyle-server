import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { Link } from '@solidjs/router';
import axios from 'axios';
import {
  Spinner,
  Container,
  Row,
  Col,
  Pagination,
  Table,
} from 'solid-bootstrap';

const BlogList: Component = (): JSX.Element => {
  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal(['']);

  const handleClick = (): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        await axios.get('https://jungho.dev/api-blog/api/blog/update');
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

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const res = await axios.get('https://jungho.dev/api-blog/api/blog');
        setList(res.data);
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
                                <Link href={'/blog' + '/' + item}>{item}</Link>
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
