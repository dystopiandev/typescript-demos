import fs from "fs"
import express from "express"
import multer from "multer"
import { parseFile } from "fast-csv"
import amqp from "./lib/amqp"
import { Message } from "@droidsolutions-oss/amqp-ts"

const app = express()
const upload = multer({ dest: ".tmp/csv/" })
const queue = amqp.declareQueue("csv_records", { durable: true })

app.post("/upload", upload.single("file"), (req, res) => {
  let count = 0

  if (!req.file) res.sendStatus(400)
  else {
    parseFile(req.file.path, { headers: true })
      .on("headers", (data) => {
        queue.send(new Message(data))
        console.log("Headers:", data)
      })
      .on("data", (data) => {
        queue.send(new Message(data))
        count++
      })
      .on("end", () => {
        fs.unlinkSync(req.file.path)
        console.log(`Processed ${count} records`)
      })

    res.sendStatus(200)
  }
})

amqp
  .completeConfiguration()
  .then(() =>
    app.listen(7070, "0.0.0.0", () => {
      console.log("HTTP server is listening: http://0.0.0.0:7070")
      console.log(`RabbitMQ server connected`)
    })
  )
  .catch((err) => console.error(err))
