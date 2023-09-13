import { fastify } from "fastify";
import { getAllPromptsRoute } from "./routes/get-all-prompts";
import { uploadVideoRoute } from "./routes/upload-video";

const app = fastify();

const port = 3333;

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);

app
  .listen({
    port: port,
  })
  .then(() => {
    console.log(`HTTP Server Running at port :${port} `);
  });
