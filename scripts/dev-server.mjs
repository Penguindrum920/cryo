import { createServer } from "node:http";
import next from "next";

const port = Number.parseInt(process.env.PORT ?? "3005", 10);
const hostname = process.env.HOSTNAME ?? "0.0.0.0";

const app = next({
  dev: true,
  hostname,
  port,
  dir: process.cwd(),
});

const handle = app.getRequestHandler();

await app.prepare();

createServer((req, res) => {
  handle(req, res);
}).listen(port, hostname, () => {
  console.log(`Cryo dev server ready on http://localhost:${port}`);
});
