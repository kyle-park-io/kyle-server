import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, For } from 'solid-js';
import { A } from '@solidjs/router';
import {
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Pagination,
  Table,
} from 'solid-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { globalState } from '../constants/constants';

const BlogList: Component = (): JSX.Element => {
  const api_url = globalState.api_url;

  const [error, setError] = createSignal<Error | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [list, setList] = createSignal(['']);
  const [page, setPage] = createSignal(0);
  const [pages, setPages] = createSignal(Array(0).fill(''));
  const [currentPage, setCurrentPage] = createSignal(1);

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

  const handlePageClick = (index: number): void => {
    async function handleAsyncClick(): Promise<void> {
      try {
        if (index === 0 || index === page() + 1 || index === currentPage()) {
          return;
        }
        setLoading(false);

        const params = {
          number: index,
        };
        const blogList = await axios.get(
          `${api_url}/api/blog/sorted-by-date/pagination`,
          { params },
        );

        // let result: string[] = [];
        // for (let i = 0; i < blogList.data.length; i++) {
        //   // result.push(blogList.data[i].split('.')[0]);
        // }
        // setList(result);
        setList(blogList.data);
        setCurrentPage(index);

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
    void handleAsyncClick();
  };

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        // const res = await axios.get(`${api_url}/api/blog`);
        // setList(res.data);

        const blogNumber = await axios.get(`${api_url}/api/blog/number`);
        setPage(Math.ceil((blogNumber.data as unknown as number) / 10));
        setPages(Array(page()).fill(''));

        const blogList = await axios.get(
          `${api_url}/api/blog/sorted-by-date/top-10`,
        );
        // let result: string[] = [];
        // for (let i = 0; i < blogList.data.length; i++) {
        //   result.push(blogList.data[i].split('.')[0]);
        // }
        // setList(result);
        setList(blogList.data);

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
            <h1>BlogList</h1>
            <br></br>
          </Col>
          <div class="tw-flex-1 tw-flex tw-flex-col">
            <div class="tw-flex-1 tw-flex tw-justify-center tw-items-center tw-flex-col">
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
                      <button
                        onClick={handleClick}
                        class="tw-bg-blue-500 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded"
                      >
                        Update
                      </button>
                      <div>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Head</th>
                              <th>Download</th>
                            </tr>
                          </thead>
                          <For each={list()}>
                            {(item, index) => (
                              <tr>
                                <td>
                                  {(currentPage() - 1) * 10 + index() + 1}
                                </td>
                                <td>
                                  <A
                                    href={
                                      '/blog' +
                                      '/' +
                                      item.filename.split('.')[0]
                                    }
                                  >
                                    {item.title}
                                  </A>
                                </td>
                                <td>
                                  <Button
                                    onClick={() => {
                                      handleButtonClick(
                                        item.filename.split('.')[0],
                                      );
                                    }}
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
                    </>
                  )}
                </>
              )}
            </div>
            <div class="tw-flex tw-items-center tw-justify-center">
              <Pagination size="sm">
                <Pagination.First
                  onClick={() => {
                    handlePageClick(1);
                  }}
                />
                <Pagination.Prev
                  onClick={() => {
                    handlePageClick(currentPage() - 1);
                  }}
                />
                {pages().map((value, index) => (
                  <Pagination.Item
                    active={currentPage() === index + 1}
                    onClick={() => {
                      handlePageClick(index + 1);
                    }}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                {/* <Pagination.Ellipsis /> */}
                <Pagination.Next
                  onClick={() => {
                    handlePageClick(currentPage() + 1);
                  }}
                />
                <Pagination.Last
                  onClick={() => {
                    handlePageClick(page());
                  }}
                />
              </Pagination>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default BlogList;
