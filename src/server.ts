import createServer from "./app";
import http, { Server } from "http";

const port: string = process.env.PORT;

createServer().then((app) => {
  let server: Server;
  server = http.createServer(app);

  server = server
    .listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    })
    .on("error", (err) => {
      console.error("Error creating HTTPS server:", err.message);
    });
});
