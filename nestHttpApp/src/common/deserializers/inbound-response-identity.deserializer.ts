// src/common/deserializers/inbound-response-identity.deserializer.ts
import { ProducerDeserializer, IncomingResponse } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class InboundResponseIdentityDeserializer
  implements ProducerDeserializer {
  private readonly logger = new Logger('InboundResponseIdentityDeserializer');

  deserialize(value: any): IncomingResponse {
    this.logger.verbose(
      `<<-- deserializing inbound response:\n${JSON.stringify(value)}`,
    );
    return value;
  }
}
