import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';
import { Form, Button, Image } from 'solid-bootstrap';
import { globalState } from '../constants/constants';
import { ChatClient } from './commonjs+dts/chat_grpc_web_pb';
import { ChatMsg } from './commonjs+dts/chat_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { v4 as uuidv4 } from 'uuid';
import ChatImg from '@public/chat2-bg.svg';

const Chat: Component = (): JSX.Element => {
  const [userId, setUserId] = createSignal('');
  const [text, setText] = createSignal('');

  const handleSendClick = (): void => {
    const msg = new ChatMsg();
    msg.setUserId(userId());
    msg.setText(text());
    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    msg.setEventTime(timestamp);

    const client = new ChatClient(globalState.grpc_url, null, null);
    client.sendMsg(msg, {}, (err, res) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log('Response:', res);
      }
    });
  };

  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        setUserId(uuidv4());
      } catch (err) {
        console.log(err);
      }
    }
    void fetchData();
  });

  return (
    <>
      <Container fluid class="tw-p-4">
        <Row>
          <Col md={12}>
            <h1>Chat</h1>
            <br></br>
          </Col>
        </Row>
        <Row>
          <Col md={8} xs={12}>
            <Form onSubmit={handleSendClick}>
              <Form.Group class="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>User Id</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={userId()}
                  value={userId()}
                  onInput={(e) => setUserId(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group class="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Body</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={text()}
                  onInput={(e) => setText(e.target.value)}
                  required
                />
              </Form.Group>
              <br></br>
              <Button variant="primary" type="submit">
                Send
              </Button>
            </Form>
          </Col>
          <Col
            md={4}
            xs={12}
            class="d-flex justify-content-center align-items-center"
          >
            <Image src={ChatImg} fluid class="d-none d-md-block"></Image>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Chat;
