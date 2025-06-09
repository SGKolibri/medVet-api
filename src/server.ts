import { app } from "./app";
import { env } from "./env";
import cors from "@fastify/cors";

app.register(cors, {
  origin: "*",
});

app
  .listen({
    host: "0.0.0.0", //seja accessível
    port: env.PORT,
  })
  .then(() => {
    console.log("🚀 HTTP Server Running !", env.PORT);
  });
