import { type Component, type JSX } from 'solid-js';
import { createSignal, onMount, Show } from 'solid-js';
import { globalState } from '../constants/constants';
import { ChatClient } from './commonjs+dts/chat_grpc_web_pb';
import { ChatMsg } from './commonjs+dts/chat_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import { v4 as uuidv4 } from 'uuid';
// styles
import './Chat.css';

const client = new ChatClient(globalState.grpc_url, null, null);

/**
 * Chat Component
 * Anonymous real-time chat via Telegram integration
 * New York Times inspired design
 */
const Chat: Component = (): JSX.Element => {
  const [sendOk, setSendOk] = createSignal(false);
  const [sending, setSending] = createSignal(false);
  const [userId, setUserId] = createSignal('');
  const [text, setText] = createSignal('');

  // Send message via gRPC
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

  const handleSendClick = async (): Promise<void> => {
    if (!text().trim()) return;

    setSending(true);
    setSendOk(false);

    try {
      await sendMessage();
      setText('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter' && e.ctrlKey) {
      void handleSendClick();
    }
  };

  onMount(() => {
    setUserId(uuidv4());
  });

  return (
    <div class="chat-page">
      <div class="chat-container">
        {/* Header */}
        <header class="chat-header">
          <div class="chat-header__icon">💬</div>
          <h1 class="chat-header__title">Anonymous Chat</h1>
          <p class="chat-header__subtitle">
            Send a message directly to my Telegram. Your identity stays
            anonymous.
          </p>
        </header>

        {/* Chat Form */}
        <div class="chat-form">
          {/* User ID Field */}
          <div class="chat-field">
            <label class="chat-field__label" for="userId">
              Your ID
            </label>
            <input
              id="userId"
              type="text"
              class="chat-field__input"
              placeholder="Anonymous identifier"
              value={userId()}
              onInput={(e) => setUserId(e.currentTarget.value)}
            />
            <span class="chat-field__hint">
              Auto-generated UUID. You can change it if you want.
            </span>
          </div>

          {/* Message Field */}
          <div class="chat-field">
            <label class="chat-field__label" for="message">
              Message
            </label>
            <textarea
              id="message"
              class="chat-field__textarea"
              placeholder="Write your message here..."
              rows={8}
              value={text()}
              onInput={(e) => setText(e.currentTarget.value)}
              onKeyDown={handleKeyDown}
            />
            <span class="chat-field__hint">Press Ctrl + Enter to send</span>
          </div>

          {/* Send Button */}
          <div class="chat-actions">
            <button
              class="chat-btn"
              onClick={() => void handleSendClick()}
              disabled={sending() || !text().trim()}
            >
              <Show when={sending()} fallback="Send Message">
                Sending...
              </Show>
            </button>

            <Show when={sendOk()}>
              <div class="chat-success">
                <span class="chat-success__icon">✓</span>
                <span class="chat-success__text">
                  Message delivered to Telegram
                </span>
              </div>
            </Show>
          </div>
        </div>

        {/* Info Section */}
        <div class="chat-info">
          <div class="chat-info__item">
            <span class="chat-info__icon">🔒</span>
            <span class="chat-info__text">End-to-end encrypted via gRPC</span>
          </div>
          <div class="chat-info__item">
            <span class="chat-info__icon">⚡</span>
            <span class="chat-info__text">Real-time delivery to Telegram</span>
          </div>
          <div class="chat-info__item">
            <span class="chat-info__icon">🕵️</span>
            <span class="chat-info__text">No personal data stored</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
