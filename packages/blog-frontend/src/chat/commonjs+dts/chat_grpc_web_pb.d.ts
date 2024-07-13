import * as grpcWeb from 'grpc-web';

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as chat_pb from './chat_pb'; // proto import: "chat.proto"

export class ChatClient {
  constructor(
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: any },
  );

  sendMsgTest(
    request: chat_pb.TestMsg,
    metadata: grpcWeb.Metadata | undefined,
    callback: (
      err: grpcWeb.RpcError,
      response: google_protobuf_wrappers_pb.StringValue,
    ) => void,
  ): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  sendMsg(
    request: chat_pb.ChatMsg,
    metadata: grpcWeb.Metadata | undefined,
    callback: (
      err: grpcWeb.RpcError,
      response: google_protobuf_wrappers_pb.StringValue,
    ) => void,
  ): grpcWeb.ClientReadableStream<google_protobuf_wrappers_pb.StringValue>;

  getMsgTest(
    request: chat_pb.GetTestMsg,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError, response: chat_pb.TestMsg) => void,
  ): grpcWeb.ClientReadableStream<chat_pb.TestMsg>;

  getMsg(
    request: chat_pb.GetChatMsg,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError, response: chat_pb.ChatMsg) => void,
  ): grpcWeb.ClientReadableStream<chat_pb.ChatMsg>;
}

export class ChatPromiseClient {
  constructor(
    hostname: string,
    credentials?: null | { [index: string]: string },
    options?: null | { [index: string]: any },
  );

  sendMsgTest(
    request: chat_pb.TestMsg,
    metadata?: grpcWeb.Metadata,
  ): Promise<google_protobuf_wrappers_pb.StringValue>;

  sendMsg(
    request: chat_pb.ChatMsg,
    metadata?: grpcWeb.Metadata,
  ): Promise<google_protobuf_wrappers_pb.StringValue>;

  getMsgTest(
    request: chat_pb.GetTestMsg,
    metadata?: grpcWeb.Metadata,
  ): Promise<chat_pb.TestMsg>;

  getMsg(
    request: chat_pb.GetChatMsg,
    metadata?: grpcWeb.Metadata,
  ): Promise<chat_pb.ChatMsg>;
}
