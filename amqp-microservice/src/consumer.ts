import amqp from "./lib/amqp"

const queue = amqp.declareQueue("csv_records", { durable: true, prefetch: 1 })
const throttleMs = process.argv[2] ?? 5000

amqp
  .completeConfiguration()
  .then(() => {
    queue
      .activateConsumer((msg) => {
        console.log(new Date(), msg.getContent())
        setTimeout(() => {
          msg.ack()
        }, parseInt(throttleMs))
      })
      .then(() => console.log(`Throttling consumer at ${throttleMs}ms`))
      .catch((err) => console.error(err))
  })
  .catch((err) => console.error(err))
