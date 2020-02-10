// src/common/deserializers/inbound-message-identity.deserializer.ts
import {
  ConsumerDeserializer,
  IncomingRequest,
  IncomingEvent,
} from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

export class InboundMessageIdentityDeserializer
  implements ConsumerDeserializer {
  private readonly logger = new Logger('InboundMessageIdentityDeserializer');

  deserialize(value: any, options?: Record<string, any>): IncomingRequest {
    this.logger.verbose(
      `<<-- deserializing inbound message:\n${JSON.stringify(
        value,
      )}\n\twith options: ${JSON.stringify(options)}`,
    );
    return value;
  }
}
