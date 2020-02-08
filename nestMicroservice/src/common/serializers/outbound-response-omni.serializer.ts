// src/common/serializers/outbound-response-omni.serializer.ts
import { Serializer, OutgoingResponse } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class OutboundResponseOmniSerializer implements Serializer {
  private readonly logger = new Logger('OutboundResponseExternalSerializer');
  serialize(value: any): OutgoingResponse {
    this.logger.debug(
      `-->> Serializing outbound response: \n${JSON.stringify(value)}`,
    );

    if (value && value.id && /EXT-/.test(value.id)) {
      return value.response;
    } else {
      return value;
    }
  }
}
