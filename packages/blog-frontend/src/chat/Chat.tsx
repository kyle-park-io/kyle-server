import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount } from 'solid-js';
import { Container, Row, Col, Form, Button, Image } from 'solid-bootstrap';
import { globalState } from '../constants/constants';
import { ChatClient } from './commonjs+dts/chat_grpc_web_pb';
import { ChatMsg } from './commonjs+dts/chat_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { v4 as uuidv4 } from 'uuid';
import ChatImg from '@public/chat2-bg.svg';

const client = new ChatClient(globalState.grpc_url, null, null);

const [sendOk, setSendOk] = createSignal(false);
const [userId, setUserId] = createSignal('');
const [text, setText] = createSignal('');

async function sendMessage(): Promise<any> {
  return await new Promise((resolve, reject) => {
    const msg = new ChatMsg();
    msg.setUserId(userId());
    msg.setText(text());
    const now = new Date();
    const timestamp = Timestamp.fromDate(now);
    msg.setEventTime(timestamp);

    client.sendMsg(msg, {}, (err, res) => {
      if (err != null) {
        console.error('Error:', err);
        setSendOk(false);
        reject(err);
      } else {
        console.log('Response:', res);
        setSendOk(true);
        resolve(res);
      }
    });
  });
}

const Chat: Component = (): JSX.Element => {
  const handleSendClick = async (): Promise<void> => {
    try {
      const response = await sendMessage();
      console.log('Response:', response);
      // setTimeout(() => {}, 10000);
      // return response;
    } catch (error) {
      console.error('Error:', error);
      // throw error;
    }
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
            <Form>
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
              <Button
                variant="primary"
                onClick={() => {
                  void handleSendClick();
                }}
              >
                Send
              </Button>
              {sendOk() && <span>successfully reached Telegram</span>}
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
