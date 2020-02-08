// src/common/serializers/outbound-response-external.serializer.ts
import { Serializer, OutgoingResponse } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class OutboundResponseExternalSerializer implements Serializer {
  private readonly logger = new Logger('OutboundResponseExternalSerializer');
  serialize(value: any): OutgoingResponse {
    this.logger.debug(
      `-->> Serializing outbound response: \n${JSON.stringify(value)}`,
    );

    /**
     * Here, we are merely "unpacking" the response payload from the Nest
     * message structure, and returning it as a "plain" top-level object.
     */

    return value.response;
  }
}
