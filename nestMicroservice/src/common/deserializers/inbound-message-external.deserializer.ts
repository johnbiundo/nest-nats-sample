// src/common/deserializers/inbound-message-external.deserializer.ts
import { Logger } from '@nestjs/common';
import * as uuid from 'uuid/v4';
import { ConsumerDeserializer } from '@nestjs/microservices';

export class InboundMessageExternalDeserializer
  implements ConsumerDeserializer {
  private readonly logger = new Logger('InboundMessageExternalDeserializer');
  deserialize(value: any, options?: Record<string, any>) {
    this.logger.verbose(
      `<<-- deserializing inbound external message:\n${JSON.stringify(
        value,
      )}\n\twith options: ${JSON.stringify(options)}`,
    );

    /**
     * Here, we merely wrap our inbound message payload in the standard Nest
     * message structure.
     */
    return {
      pattern: undefined,
      data: value,
      id: uuid(),
    };
  }
}
