import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  EventPattern,
  Payload,
  Ctx,
  NatsContext,
} from '@nestjs/microservices';

interface Customer {
  id: number;
  name: string;
}

const customerList: Customer[] = [{ id: 1, name: 'nestjs.com' }];
let lastId = customerList.length;

@Controller()
export class AppController {
  logger = new Logger('AppController');

  /**
   * Register a message handler for 'get-customers' requests
   */
  @MessagePattern('get-customers')
  getCustomers(@Payload() data: any, @Ctx() context: NatsContext) {
    const customers =
      data && data.id
        ? customerList.filter(cust => cust.id === parseInt(data.id, 10))
        : customerList;
    return { customers };
  }

  /**
   * Register an event handler for 'add-customer' events
   */
  @EventPattern('add-customer')
  addCustomer(@Payload() customer: Customer, @Ctx() context: NatsContext) {
    customerList.push({
      id: lastId + 1,
      name: customer.name,
    });
    lastId++;
  }
}
