import { FastifyInstance } from "fastify";
import { fastifyMultipart } from "@fastify/multipart";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream";
import fs from "node:fs";
import { promisify } from "node:util";
import { prisma } from "../lib/prisma";

const pump = promisify(pipeline);

export async function uploadVideoRoute(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 1_048_576 * 25, //25mb
    },
  });
  app.post("/videos", async (req, reply) => {
    const data = await req.file();

    if (!data) {
      return reply.status(400).send("Missing file input");
    }

    const extensions = path.extname(data.filename);

    if (extensions != ".mp3") {
      return reply.status(400).send("Invalid input type, please upload a MP3.");
    }

    const fileBaseName = path.basename(data.filename, extensions);
    const fileUploadName = `${fileBaseName}-${randomUUID()}${extensions}`;

    const uploadDestination = path.resolve(
      __dirname,
      "../../tmp",
      fileUploadName,
    );

    await pump(data.file, fs.createWriteStream(uploadDestination));

    const video = await prisma.video.create({
      data: {
        name: data.filename,
        path: uploadDestination,
      },
    });

    return {
      video,
    };
  });
}
