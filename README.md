# Sample repository for Nest/Nats/Microservice Article Series

This repository is a companion for a series of blog posts starting with [Integrate NestJS with External Services using Microservice Transporters (Part 1)](https://dev.to/nestjs/integrate-nestjs-with-external-services-using-microservice-transporters-part-1-p3).

## System Requirements

These examples assume you have the latest [NestJS](https://github.com/nestjs/nest) (e.g., `@nestjs/cli@latest`; as of this writing, that's 6.14.2) installed. In particular, you need to have `@nestjs/microservices` version >= 6.11.6.

You'll also want [Docker](https://www.docker.com/get-started) to run [NATS](https://docs.nats.io/) (unless you prefer to install NATS locally).

I personally use Ubuntu to run Nest and NATS, so scripts are built and tested with that in mind.

While all code and scripts should be portable to other OS's, you may have to make some small adjustments, especially in things like `package.json` scripts, Docker, and NATS.

## Installation

#### Clone the repository

```bash
git clone git@github.com:johnbiundo/nest-nats-sample.git
```

#### Install dependencies

Either `cd` into each project folder and run `npm install`:

```bash
cd nest-nats-sample/customerApp
npm install
cd ../customerService
npm install
# etc
```

Or, **do that all in one** go with the `build.sh` script:

```bash
# from nest-nats-sample
sh build.sh
```

## Running NATS

You can easily run a local copy of NATS (say on an Ubuntu server), but I strongly prefer Docker. Assuming Docker is installed, you can run this at the command line:

```bash
# from nest-nats-sample directory
docker-compose up
```

This starts a container running the official [NATS image](https://docs.nats.io/nats-server/nats_docker). The container runs in the foreground and uses the [`-Dv` flag](https://docs.nats.io/nats-server/flags#logging-options) so you can watch the message traffic as you run the various code samples.

## Pro Tip: Use Tmux (optional)!

If you want to get more familiar with how Nest and NATS play together, you're going to want to run several servers and interact with and monitor them from the command line. (Aside: this is one of the reasons I use Ubuntu (over Windows) for this kind of work. I find it much easier to work with multiple server processes. Anyway...)

If you're interested in learning Tmux, here's a [good place to start](https://linuxize.com/post/getting-started-with-tmux/). I've also included my `.tmux.conf` file, which does a few useful things:

- Maps the "prefix" key sequence to `Ctrl-a`.
- Maps F11 and F12 to _previous pane_ and _next pane_ respectively
- Creates nice pane titles

As an inducement to use it, here's what mine looks like when running some of the code in this repo. It's super handy to be able to tab through these panes, run commands, and watch the logs.
![tmux](https://user-images.githubusercontent.com/6937031/74091865-8d439d80-4a71-11ea-9217-6f9af4094deb.png)

## Running the All-Nest Configuration

To run an "All-Nest" configuration &#8212; that is, the **Nest requestor** (_nestHttpApp_) and the **Nest responder** (_nestMicroservice_) communicating with each other in a "classic" Nest microservices mode, follow these steps:

1. With NATS [up and running](#running-nats), launch the _nestMicroservice_ app in one window:

   ```bash
   # from the nest-nats-sample/nestMicroservice directory
   npm run start:dev
   ```

2. Launch the _nestHttpApp_ in a separate window:

   ```bash
   # from the nest-nats-sample/nestHttpApp directory
   npm run start:dev
   ```

3. In a third window, simulate REST requests with [cURL](https://curl.haxx.se/) or [httPie](https://httpie.org/). The following are shown as _httPie_ commands at the OS command line:

   > \# get all customers
   > http get localhost:3000/customers

   The expected response is:

   ```json
   {
     "customers": [
       {
         "id": 1,
         "name": "nestjs.com"
       }
     ]
   }
   ```

   > \# get customer by id (passing id of 1)
   > http get localhost:3000/customers/1

   The expected response is:

   ```json
   {
     "customers": [
       {
         "id": 1,
         "name": "nestjs.com"
       }
     ]
   }
   ```

   > \# add a customer
   > http post localhost:3000/customer name="Nestles, Inc"

   > \# get all customers
   > http get localhost:3000/customers

   The expected response is:

   ```json
   {
     "customers": [
       {
         "id": 1,
         "name": "nestjs.com"
       },
       {
         "id": 2,
         "name": "Nestles, inc."
       }
     ]
   }
   ```

## Running the All-Native-App Configuration

To run an "All-Native-App" configuration &#8212; that is, the native TypeScript/NATS **requestor** (_customerApp_) and the native TypeScript/NATS **responder** (_customerService_) communicating with each other over NATS, follow these steps:

1. It's best to stop the running Nest apps if they are still running from earlier.

2. With NATS [up and running](#running-nats), build, then launch the _customerService_ app in one window:

   ```bash
   # from the nest-nats-sample/customerService directory
   npm run build
   npm run start
   ```

3. Build, then run the _customerApp_ in a separate window:

   ```bash
   # from the nest-nats-sample/customerApp directory
   #
   # first build the app
   npm run build
   # run the requestor, passing the 'get-customers' option
   npm run get-customers
   # run the requestor, passing the 'add-customer' option and a new customer
   npm run add-customer "Hersheys, Inc."
   # get customers again
   npm run get-customers
   ```

   You should see some verbose output in each of the windows. It can be very helpful to trace through the code, the logging output, and the NATS server log to correlate each step in the process and to get familiar with the message flows.
