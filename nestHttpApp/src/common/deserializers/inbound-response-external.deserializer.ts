// src/common/deserializers/inbound-response-external.deserializer.ts
import { WritePacket, Deserializer } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

export class InboundResponseExternalDeserializer implements Deserializer {
  private readonly logger = new Logger('InboundResponseExternalDeserializer');

  deserialize(value: any): WritePacket {
    this.logger.verbose(
      `<<-- deserializing inbound response:\n${JSON.stringify(value)}`,
    );

    /**
     * Here, we wrap the external payload received in a standard Nest
     * response message.  Note that we have omitted the `id` field, as it
     * does not have any meaning from an external responder.  Because of this,
     * we have to also:
     *   1) implement the `Deserializer` interface instead of the
     *      `ProducerDeserializer` interface used in the identity deserializer
     *   2) return an object with the `WritePacket` interface, rather than
     *      the`IncomingResponse` interface used in the identity deserializer.
     */
    return {
      err: undefined,
      response: value,
      isDisposed: true,
    };
  }
}
