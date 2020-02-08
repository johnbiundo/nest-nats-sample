// src/common/serializers/outbound-message-identity.serializer.ts
import { Logger } from '@nestjs/common';
import { Serializer } from '@nestjs/microservices';

export class OutboundMessageIdentitySerializer implements Serializer {
  private readonly logger = new Logger('OutboundMessageIdentitySerializer');
  serialize(value: any) {
    this.logger.debug(
      `-->> Serializing outbound message: \n${JSON.stringify(value)}`,
    );
    return value;
  }
}
