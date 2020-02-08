// src/common/serializers/outbound-message-external.serializer.ts
import { Logger } from '@nestjs/common';
import { Serializer } from '@nestjs/microservices';

export class OutboundMessageExternalSerializer implements Serializer {
  private readonly logger = new Logger('OutboundMessageExternalSerializer');
  serialize(value: any) {
    this.logger.debug(
      `-->> Serializing outgoing message: \n${JSON.stringify(value)}`,
    );

    /**
     * Here, we are merely "unpacking" the request payload from the Nest
     * message structure and returning it as a "plain" top-level object.
     */
    return value.data;
  }
}
