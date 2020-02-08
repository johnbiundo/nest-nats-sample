import { connect } from 'ts-nats';

const NATS_URL = 'nats://localhost:4222';

// NATS connection
let nats;

// make "get customers" request by sending NATS **request** with "get-customers" topic
async function getCustomers(id) {
  try {
    console.log(`Sending 'get-customers' request`);
    const response = await nats.request(
      'get-customers',
      1000,
      JSON.stringify({ id })
    );
    console.log(
      '\n========== <<< reply message >>> ==========\n',
      response,
      '\n===========================================\n'
    );
    console.log(
      'getCustomers reply: \n',
      JSON.stringify(JSON.parse(response.data), null, 2)
    );
  } catch (error) {
    console.log('Error sending request: ', error);
  }
}

// send "add customer" event by publishing NATS **message** with "add-customer" topic
async function addCustomer(name) {
  try {
    await nats.publish('add-customer', JSON.stringify({ name }));
    console.log(
      `Publishing add-customer event with payload:\n${JSON.stringify(
        {
          name,
        },
        null,
        2
      )}`
    );
  } catch (error) {
    console.log('Error publishing event: ', error);
  }
}

function usage() {
  console.log('Usage: node customer-app add <customer-name> | get [id]');
  console.log('\t get [id]: send get-customers request and print response');
  console.log(
    '\t\t if id is passed, get matching customer by id, else get all\n'
  );
  console.log('\t add <customer-name> : send add-customer event');
  process.exit(0);
}

// make sure we get a command argument on OS cmd line
if (process.argv.length < 3) {
  usage();
}

async function main() {
  try {
    nats = await connect({
      servers: [NATS_URL],
      timeout: 1000,
    });
    console.log('Connected to NATS...');

    // Call appropriate function based on cmd line arg
    if (process.argv[2] === 'add') {
      if (process.argv[3]) {
        await addCustomer(process.argv[3]);
      } else {
        usage();
      }
    } else if (process.argv[2] === 'get') {
      await getCustomers(process.argv[3]);
    } else {
      usage();
    }

    // avoid closing connection before message is sent!
    await nats.flush();
    process.exit(0);
  } catch (error) {
    console.log('Error connecting to NATS: ', error);
    process.exit(0);
  }
}

main();
