import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

import { OutboundResponseIdentitySerializer } from './common/serializers/outbound-response-identity.serializer';
import { InboundMessageIdentityDeserializer } from './common/deserializers/inbound-message-identity.deserializer';

import { InboundMessageExternalDeserializer } from './common/deserializers/inbound-message-external.deserializer';
import { OutboundResponseExternalSerializer } from './common/serializers/outbound-response-external.serializer';

import { InboundMessageOmniDeserializer } from './common/deserializers/inbound-message-omni.deserializer';
import { OutboundResponseOmniSerializer } from './common/serializers/outbound-response-omni.serializer';

async function bootstrap() {
  const logger = new Logger('Main:bootstrap');
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.NATS,
    options: {
      queue: 'customers',
      url: 'nats://localhost:4222',
      /**
       * Use the "Identity" (De)Serializers for observing messages for
       * nest-only deployment.
       */
      // serializer: new OutboundResponseIdentitySerializer(),
      // deserializer: new InboundMessageIdentityDeserializer(),

      /**
       * Use the "External" (De)Serializers for transforming messages to/from
       * an external requestor
       */
      // serializer: new OutboundResponseExternalSerializer(),
      // deserializer: new InboundMessageExternalDeserializer(),

      /**
       * Use the "Omni" (De)Serializers for simultaneously supporting
       * external requestors and any Nest requestors which haven't been
       * modified to serialize to the "neutral" (external) message
       * format.
       */
      // serializer: new OutboundResponseOmniSerializer(),
      // deserializer: new InboundMessageOmniDeserializer(),
    },
  });
  app.listen(() => logger.verbose('Microservice is listening...'));
}

bootstrap();
