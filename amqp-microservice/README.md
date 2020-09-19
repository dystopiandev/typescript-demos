# AMQP-based Microservice

## Requirements
- RabbitMQ server
- Node.js

## Setup
```bash
npm install
```

## Microservice A: Producer
Parses uploaded CSV, dumps rows in RabbitMQ queue
```bash
npm run producer
```

## Microservice B: Consumer
Processes data in RabbitMQ queue
```bash
npm run consumer <milliseconds>
# Example for 3 seconds throttling: npm run consumer 3000
```