import { type Component, type JSX } from 'solid-js';
import { onMount } from 'solid-js';
import { Container, Row, Col } from 'solid-bootstrap';
import { globalState } from '../constants/constants';
import { ChatClient } from './commonjs+dts/chat_grpc_web_pb';
import { ChatMsg } from './commonjs+dts/chat_pb';

import { v4 as uuidv4 } from 'uuid';

const Chat: Component = (): JSX.Element => {
  onMount(() => {
    async function fetchData(): Promise<void> {
      try {
        const client = new ChatClient(globalState.grpc_url, null, null);
        const userId = uuidv4();
        const msg = new ChatMsg();
        msg.setUserId(userId);
        client.sendMsg(msg, {}, (err, res) => {
          if (err) {
            console.error('Error:', err);
          } else {
            console.log('Response:', res);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
    void fetchData();
  });

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={12}>
            <h1>Chat</h1>
          </Col>
        </Row>
        <Row>
          <Col md={8}>
            <span>body</span>
          </Col>
          <Col md={4}>image</Col>
        </Row>
      </Container>
    </>
  );
};

export default Chat;
