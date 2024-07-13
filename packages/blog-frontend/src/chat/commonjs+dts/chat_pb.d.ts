import * as jspb from 'google-protobuf';

import * as google_protobuf_wrappers_pb from 'google-protobuf/google/protobuf/wrappers_pb'; // proto import: "google/protobuf/wrappers.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"

export class TestMsg extends jspb.Message {
  getId(): number;
  setId(value: number): TestMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TestMsg.AsObject;
  static toObject(includeInstance: boolean, msg: TestMsg): TestMsg.AsObject;
  static serializeBinaryToWriter(
    message: TestMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): TestMsg;
  static deserializeBinaryFromReader(
    message: TestMsg,
    reader: jspb.BinaryReader,
  ): TestMsg;
}

export namespace TestMsg {
  export type AsObject = {
    id: number;
  };
}

export class ChatMsg extends jspb.Message {
  getId(): number;
  setId(value: number): ChatMsg;

  getUserId(): string;
  setUserId(value: string): ChatMsg;

  getText(): string;
  setText(value: string): ChatMsg;

  getEventTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEventTime(value?: google_protobuf_timestamp_pb.Timestamp): ChatMsg;
  hasEventTime(): boolean;
  clearEventTime(): ChatMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ChatMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ChatMsg): ChatMsg.AsObject;
  static serializeBinaryToWriter(
    message: ChatMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): ChatMsg;
  static deserializeBinaryFromReader(
    message: ChatMsg,
    reader: jspb.BinaryReader,
  ): ChatMsg;
}

export namespace ChatMsg {
  export type AsObject = {
    id: number;
    userId: string;
    text: string;
    eventTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}

export class GetTestMsg extends jspb.Message {
  getId(): number;
  setId(value: number): GetTestMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTestMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetTestMsg,
  ): GetTestMsg.AsObject;
  static serializeBinaryToWriter(
    message: GetTestMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetTestMsg;
  static deserializeBinaryFromReader(
    message: GetTestMsg,
    reader: jspb.BinaryReader,
  ): GetTestMsg;
}

export namespace GetTestMsg {
  export type AsObject = {
    id: number;
  };
}

export class GetChatMsg extends jspb.Message {
  getId(): number;
  setId(value: number): GetChatMsg;

  getUserId(): string;
  setUserId(value: string): GetChatMsg;

  getEventTime(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setEventTime(value?: google_protobuf_timestamp_pb.Timestamp): GetChatMsg;
  hasEventTime(): boolean;
  clearEventTime(): GetChatMsg;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetChatMsg.AsObject;
  static toObject(
    includeInstance: boolean,
    msg: GetChatMsg,
  ): GetChatMsg.AsObject;
  static serializeBinaryToWriter(
    message: GetChatMsg,
    writer: jspb.BinaryWriter,
  ): void;
  static deserializeBinary(bytes: Uint8Array): GetChatMsg;
  static deserializeBinaryFromReader(
    message: GetChatMsg,
    reader: jspb.BinaryReader,
  ): GetChatMsg;
}

export namespace GetChatMsg {
  export type AsObject = {
    id: number;
    userId: string;
    eventTime?: google_protobuf_timestamp_pb.Timestamp.AsObject;
  };
}
