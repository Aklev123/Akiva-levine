import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "../preview");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const urlPath = req.url?.split("?")[0] ?? "/";
  let relativePath = urlPath;

  if (relativePath.endsWith("/")) {
    relativePath = path.join(relativePath, "index.html");
  }

  const filePath = path.join(rootDir, relativePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] ?? "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
});

server.listen(port, "0.0.0.0", () => {
  console.log(`SlideZeroIntro preview running at http://localhost:${port}`);
  console.log("Press Ctrl+C to stop the preview server.");
});
