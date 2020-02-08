// src/common/deserializers/inbound-message-omni.deserializer.ts
import { Logger } from '@nestjs/common';
import { ConsumerDeserializer, IncomingRequest } from '@nestjs/microservices';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

import * as uuid from 'uuid/v4';

export class InboundMessageOmniDeserializer implements ConsumerDeserializer {
  private readonly logger = new Logger('InboundMessageOmniDeserializer');
  deserialize(value: any, options?: Record<string, any>) {
    this.logger.verbose(
      `<<-- deserializing inbound external message:\n${JSON.stringify(
        value,
      )}\n\twith options: ${JSON.stringify(options)}`,
    );

    /**
     * Our omni deserializer handles either external formatted messages (which
     * can originate from our external clients, or our newly capable Nest
     * apps that use the external serializer), or from "old" Nest apps that
     * continue to issue Nest-formatted messages.
     */
    if (this.isInternal(value)) {
      return value;
    } else {
      /**
       * If the message source is external, and it's a request, we generate a
       * uniquely formatted `id` field.  We prefix these ids with the string
       * `'EXT'` so they can be recognized and the response message can be
       * properly serialized. This pairs up with the `OutboundResponseOmniSerializer` class,
       * which looks for this unique id format and serializes a response appropriate
       * for the requestor.
       */
      return {
        pattern: undefined,
        data: value,
        id: options && options.replyTo ? `EXT-${uuid()}` : undefined,
      };
    }
  }

  isInternal(value: any): boolean {
    if (
      !isUndefined((value as IncomingRequest).pattern) &&
      !isUndefined((value as IncomingRequest).data) &&
      !isUndefined((value as IncomingRequest).id)
    ) {
      return true;
    }
    return false;
  }
}
