import { Controller, Get, Post, Logger, Param, Body } from '@nestjs/common';
import { ClientProxy, Client, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { InboundResponseIdentityDeserializer } from './common/deserializers/inbound-response-identity.deserializer';
import { OutboundMessageIdentitySerializer } from './common/serializers/outbound-message-identity.serializer';

import { OutboundMessageExternalSerializer } from './common/serializers/outbound-message-external.serializer';
import { InboundResponseExternalDeserializer } from './common/deserializers/inbound-response-external.deserializer';

@Controller()
export class AppController {
  logger = new Logger('AppController');

  @Client({
    transport: Transport.NATS,
    options: {
      url: 'nats://localhost:4222',
      /**
       * Use the "Identity" (de)serializers for observing messages for
       * nest-only deployment.
       */
      // serializer: new OutboundMessageIdentitySerializer(),
      // deserializer: new InboundResponseIdentityDeserializer(),

      /**
       * Use the "External" (de)serializers for transforming messages to/from
       * (only) an external responder
       */
      // serializer: new OutboundMessageExternalSerializer(),
      // deserializer: new InboundResponseExternalDeserializer(),
    },
  })
  client: ClientProxy;

  /**
   * Route 'GET customers' sends request with topic 'get-customers' via NATS.
   *
   * For testing with httPie: http get localhost:3000/customers
   */
  @Get('customers')
  getCustomers(): Observable<any> {
    this.logger.log('client#send -> topic: "get-customers"');
    /**
     * Send the 'get-customers' request and return its response.
     *
     * The request is identified by topic "get-customers".  The payload is
     * an empty object.
     *
     * The response is an observable. Since our current context is an Http-based
     * app, Nest automatically subscribes to the result and returns the stream
     * in the HTTP response to the 'GET request' route
     */
    return this.client.send('get-customers', {});
  }

  /**
   * Route 'GET customers/id' sends request with topic 'get-customers' via NATS,
   * along with a payload containing the requested customer's id.
   *
   * For testing with httPie: http get localhost:3000/customers/1
   */
  @Get('customers/:id')
  async getCustomersById(@Param('id') id: number): Promise<any> {
    this.logger.debug(`client#send -> topic: "get-customers", id: ${id}`);
    /**
     * Send the 'get-customers' request and return its response.
     *
     * The request is identified by topic "get-customers".  It carries a
     * payload object containing the id pulled from the route parameter.
     */
    return this.client.send('get-customers', { id });
  }

  /**
   * Route 'POST customer' emits an event with the topic 'add-customer' via NATS,
   * along with a payload containing the new customer information.
   *
   * For testing with httPie: http post localhost:3000/customer name=<some name>
   */
  @Post('customer')
  addCustomer(@Body() customer: any) {
    this.logger.debug(`#client#emit -> topic: "add-customer"`);
    this.client.emit('add-customer', { name: customer.name });
  }
}
