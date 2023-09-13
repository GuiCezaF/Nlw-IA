import {fastify} from 'fastify'
import { getAllPromptsRoute } from './routes/get-all-prompts';

const app = fastify()

const port = 3333;

app.register(getAllPromptsRoute)

app.listen({
  port: port,
}).then(() => {
  console.log(`HTTP Server Running at port :${port} `)
})