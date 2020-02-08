import { connect } from 'ts-nats';
import * as util from 'util';

const NATS_URL = 'nats://localhost:4222';

const customerList = [{ id: 1, name: 'Acme, Inc.' }];
let lastId = customerList.length;

// NATS connection
let nats;

/**
 * callback handler. This is registered for 'get-customers' topic.
 *
 * @param err
 * @param message
 */
async function getCustomers(err, message): Promise<void> {
  if (err) {
    console.error(
      `Error processing request ${JSON.stringify(message, null, 2)}: ${err}`
    );
    return;
  }

  console.log(
    '\n========== <<< request message >>> ==========\n',
    JSON.stringify(message, null, 2),
    '\n=============================================\n'
  );

  if (message.reply) {
    try {
      // filter customers list if there's an `id` param
      const customers =
        message.data && JSON.parse(message.data).id
          ? customerList.filter(
              cust => cust.id === parseInt(JSON.parse(message.data).id, 10)
            )
          : customerList;
      // publish response on the `reply` using the supplied `reply` topic
      await nats.publish(message.reply, JSON.stringify({ customers }));
      console.info(
        `Reply sent for request '${message.subject}':
              ${JSON.stringify({ customers }, null, 2)}`
      );
    } catch (err) {
      console.error(`Error responding to request: ${err}`);
    }
  } else {
    console.error('Malformed request.  No reply field included in request.');
  }
}

/**
 * Callback handler. This is registered for 'add-customer' topic.
 *
 * @param err
 * @param message
 */
async function addCustomer(err, message) {
  if (err) {
    console.error(
      `Error processing request ${JSON.stringify(message, null, 2)}: ${err}`
    );
    return;
  }

  console.log(
    `\n========== <<< 'add-customer' message >>> ==========\n${util.inspect(
      message,
      false,
      0
    )}\n==========================================================\n`
  );

  const payload = JSON.parse(message.data);
  console.log(
    `\n========== <<< 'add-customer' event payload >>> ==========\n${JSON.stringify(
      payload,
      null,
      2
    )}\n==========================================================\n`
  );

  customerList.push({
    id: lastId + 1,
    name: payload.name,
  });
  lastId++;

  console.log(
    'customerList now contains: \n',
    JSON.stringify(customerList, null, 2)
  );
}

async function main() {
  try {
    nats = await connect({
      servers: [NATS_URL],
      timeout: 1000,
    });
    console.log('NATS customer service starts...');

    nats.on('connect', (client, url, serverInfo) => {
      console.log(
        'server url: ',
        url,
        '\nserver version: ',
        serverInfo.version,
        '\n================================='
      );

      nats.subscribe('get-customers', getCustomers, { queue: 'customers' });
      nats.subscribe('add-customer', addCustomer);
    });
  } catch (err) {
    console.log('Error connecting to NATS.');
    if (err.message.match(/Connection timeout/)) {
      console.log(`Is NATS server running on '${NATS_URL}' ?`);
    } else {
      console.log('NATS connection error: ', err.message);
    }
  }
}

main();
