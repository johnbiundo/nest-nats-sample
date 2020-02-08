# Sample repository for Nest/Nats/Microservice Article Series

This repository is a companion for a series of blog posts starting with [Integrate NestJS with External Services using Microservice Transporters (Part 1)]().

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
```bash
cd nest-nats-sample
npm install
```

## Running NATS

You can easily run a local copy of NATS (say on an Ubuntu server), but I strongly prefer Docker.  Assuming Docker is installed, you can run this at the command line:

```bash
# from nest-nats-sample directory
docker-compose up
```

This starts a container running the official [NATS image](https://docs.nats.io/nats-server/nats_docker) using the [`-Dv` flag](https://docs.nats.io/nats-server/flags#logging-options) so you can watch the message traffic as you run the various code samples.

## Pro Tip: Use Tmux!

If you want to get more familiar with how Nest and NATS play together, you're going to want to run several servers and interact with and monitor them from the command line.  (Aside: this is one of the reasons I use Ubuntu (over Windows) for this kind of work.  I find it much easier to work with multiple server processes.  Anyway...)

If you're interested in learning Tmux, here's a [good place to start](https://linuxize.com/post/getting-started-with-tmux/).  I've also included my `.tmux.conf` file, which does a few useful things:

* Maps the "prefix" key sequence to `Ctrl-a`.
* Maps F11 and F12 to *previous pane* and *next pane* respectively
* Creates nice pane titles

As an inducement to use it, here's what mine looks like when running some of the code in this repo.  It's super handy to be able to tab through these panes, run commands, and watch the logs.
![tmux](https://user-images.githubusercontent.com/6937031/74091865-8d439d80-4a71-11ea-9217-6f9af4094deb.png)


