# Node fundamentals

These notes are a quick revision guide for the Node.js fundamentals covered in this repository. Node.js runs JavaScript outside the browser using Google's V8 engine. It is especially useful for servers and tools that spend much of their time waiting for input/output (I/O), such as network requests, files, and databases.

## 1. Node.js globals

Node makes several values available in every CommonJS file without an explicit import:

- `__dirname`: absolute path of the directory containing the current file.
- `__filename`: absolute path of the current file.
- `module`: information about the current module, including its exports.
- `require`: loads another CommonJS module.
- `process`: information and controls for the current Node process, such as environment variables, command-line arguments, and exit codes.

```js
console.log(__dirname);
console.log(__filename);
console.log(process.argv); // command-line arguments
const port = process.env.PORT || 3000; // environment configuration
```

`__dirname` and `__filename` are CommonJS globals. They are not available in exactly the same form in native ES modules.

## 2. Modules

A module is a reusable file with its own scope. In CommonJS, every file is treated as a module, so its variables are private by default. This encapsulation prevents unrelated files from accidentally changing each other's data. Export only the public API that other files need.

### CommonJS export and import

`module.exports` is the value returned by `require()`. Export an object when a module has several public values, or export one function/class directly when that is the module's main purpose.

```js
// math.js
const taxRate = 0.18; // private implementation detail

function add(first, second) {
  return first + second;
}

module.exports = { add };
```

```js
// app.js
const { add } = require("./math");
console.log(add(2, 3));
```

This is also valid, but is usually less clear when many exports are involved:

```js
module.exports.person = "Harry";
```

Important distinction: assigning `exports = something` does not replace the exported value, because `exports` is only an initial reference to `module.exports`. Use `module.exports = something` when replacing the entire export.

### Built-in modules

Built-in modules ship with Node.js, so they do not need to be installed. Use the `node:` prefix in new code to make that explicit.

| Module | Purpose                                  | Common APIs                                                 |
| ------ | ---------------------------------------- | ----------------------------------------------------------- |
| `os`   | Operating-system information             | `os.userInfo()`, `os.uptime()`, `os.type()`, `os.freemem()` |
| `path` | Safe, platform-independent path handling | `path.join()`, `path.resolve()`, `path.extname()`           |
| `fs`   | Files and directories                    | `fs.readFile()`, `fs.writeFile()`, `fs.createReadStream()`  |
| `http` | Low-level HTTP servers and clients       | `http.createServer()`, `server.listen()`                    |

```js
const os = require("node:os");
const path = require("node:path");

console.log(os.userInfo());
const logFile = path.join(__dirname, "logs", "app.log");
console.log(logFile);
```

### File system (`fs`)

The asynchronous APIs should normally be used in servers because they do not block other requests while the operating system works. Synchronous APIs are convenient for short startup scripts, but they pause the entire Node.js process while running.

```js
const fs = require("node:fs");

fs.writeFile("message.txt", "Hello Node", "utf8", (error) => {
  if (error) throw error;
  fs.readFile("message.txt", "utf8", (readError, contents) => {
    if (readError) throw readError;
    console.log(contents);
  });
});
```

The synchronous equivalents are `fs.writeFileSync()` and `fs.readFileSync()`. Use a path built with `path.join()` rather than manually concatenating slashes.

### HTTP

`http.createServer()` registers a request handler. The handler receives a request (`req`) and a response (`res`). A response must eventually be ended with `res.end()`.

```js
const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.url === "/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, () => console.log("Server listening on port 3000"));
```

In production applications, Express or another framework commonly handles routing and middleware on top of this HTTP foundation.

## 3. Synchronous and asynchronous code

Synchronous code runs one operation at a time and waits for each operation to finish. Asynchronous code starts a potentially slow operation and allows other work to continue; Node later runs a callback or settles a promise with the result.

- Synchronous file/database/network work can block every request handled by that process.
- Asynchronous I/O improves concurrency because Node can serve other work while the operating system waits.
- Asynchronous does not mean the JavaScript itself runs in parallel. JavaScript execution uses the event loop, while some work may be handled by the operating system or Node's worker pool.

### Callback hell

Nested callbacks become hard to read, handle errors in, and maintain. This is commonly called callback hell or the pyramid of doom. Keep callbacks small, return after sending a response, and prefer promises with `async`/`await` for sequential asynchronous work.

## 4. npm and dependencies

npm (Node Package Manager) installs and manages reusable JavaScript packages. A dependency is code required by an application; a package can contain bugs or vulnerabilities, so inspect maintenance, security advisories, license, and download trends before adopting it. Weekly downloads are a useful signal, not a quality guarantee.

### Project files and dependency types

- `package.json` is the project manifest. It describes the project, scripts, runtime dependencies, development dependencies, and other metadata.
- `node_modules` contains installed packages and their dependency trees. It is generated and should normally be excluded from Git because it can be very large.
- `package-lock.json` records the exact dependency tree resolved for the project. Commit it so installs and CI use reproducible versions.
- `dependencies` contains packages required at runtime, such as a web framework.
- `devDependencies` contains development-only tools, such as test runners, linters, or `nodemon`.

Create a manifest with `npm init` (interactive) or `npm init -y` (defaults). Install packages locally for the current project:

```bash
npm install express
npm install --save-dev nodemon
npm uninstall express
```

Local installation is the normal application choice because the project controls the package version. Global installation (`npm install --global <package>`) is for command-line tools intended to be used across projects, not for importing application libraries.

Useful commands:

```bash
npm install                  # install package.json dependencies
npm install <package>@<ver>  # install a chosen version
npm update                   # update within allowed version ranges
npm outdated                 # inspect available updates
npm audit                    # check known vulnerabilities
```

`npx <command>` runs a package binary without requiring a global installation. It can use a binary from the local project's `node_modules/.bin` or fetch a package when appropriate. Check unfamiliar commands before executing them.

### Scripts

The `scripts` field gives repeatable names to project commands:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "node --test"
  }
}
```

Run a script with `npm start` for the special `start` name, or `npm run dev` / `npm run test` for other names. Scripts make local development and CI use the same commands.

### `.gitignore`

Common Node entries include:

```gitignore
node_modules/
.env
coverage/
```

Do not commit secrets from `.env`. Commit `package.json` and `package-lock.json`; after cloning, `npm install` recreates `node_modules` from those files.

## 5. The Node.js event loop

The event loop lets Node.js perform non-blocking I/O even though JavaScript execution is single-threaded. A simplified flow is:

1. Run synchronous JavaScript on the call stack.
2. Start asynchronous I/O and hand waiting work to the operating system or Node's worker pool.
3. When work completes, queue its callback or promise continuation.
4. When the call stack is empty, the event loop runs queued work.

The event loop does not make CPU-heavy JavaScript free. Large loops, expensive parsing, encryption, or image processing still block the process. Move CPU-heavy work to worker threads, a separate service, or a job queue when appropriate.

## 6. Promises and async/await

A promise represents a future result: `pending`, `fulfilled`, or `rejected`. `async` functions always return promises, and `await` pauses that function until a promise settles without blocking the whole Node process.

```js
const fs = require("node:fs/promises");

async function readConfig() {
  try {
    const contents = await fs.readFile("config.json", "utf8");
    return JSON.parse(contents);
  } catch (error) {
    console.error("Could not load configuration:", error);
    throw error;
  }
}
```

Use `Promise.all()` when independent operations can run concurrently:

```js
const [users, products] = await Promise.all([getUsers(), getProducts()]);
```

`util.promisify()` adapts an older error-first callback API to a promise API. For file operations, prefer the native promise API directly:

```js
const { promisify } = require("node:util");
const legacyRead = promisify(legacyFileReader);
```

Always handle rejection with `try/catch`, `.catch()`, or a framework-level error handler. An unhandled rejection can leave an application in an unreliable state.

## 7. Events

Node uses event-driven programming: an emitter publishes named events and listeners react to them. `EventEmitter` is useful for decoupling a producer from several consumers.

```js
const EventEmitter = require("node:events");
const orderEvents = new EventEmitter();

orderEvents.on("created", (order) => {
  console.log(`Send confirmation for order ${order.id}`);
});

orderEvents.emit("created", { id: 42 });
```

Register listeners with `.on()` before calling `.emit()`. Use `.once()` for a listener that should run only once, and remove long-lived listeners when their owner is disposed to avoid memory leaks. Many Node APIs, including servers and streams, are event emitters.

## 8. Streams

Streams process data in small chunks instead of loading an entire resource into memory. This makes them the right choice for large files, uploads, downloads, and transformed data. A stream also supports backpressure: the producer can slow down when the consumer cannot keep up.

Four stream types are:

- **Readable**: data can be consumed, such as a file read stream.
- **Writable**: data can be written, such as a file write stream.
- **Duplex**: readable and writable, such as a network socket.
- **Transform**: duplex stream that changes data as it passes through, such as compression.

```js
const fs = require("node:fs");

const input = fs.createReadStream("large.log", { encoding: "utf8" });
const output = fs.createWriteStream("large-copy.log");

input.pipe(output);
input.on("error", console.error);
output.on("finish", () => console.log("Copy complete"));
```

`fs.readFile()` loads the complete file into memory, which is unsuitable for very large files. `createReadStream()` reads incrementally, and `.pipe()` connects it to a writable destination. For multi-step pipelines, `stream.pipeline()` is preferred because it forwards errors and cleans up all involved streams.

## Quick revision checklist

- Keep modules small and export a deliberate public API.
- Prefer asynchronous I/O in servers; avoid synchronous work on request paths.
- Use `path` for paths and `fs/promises` with `async`/`await` for modern file operations.
- Keep runtime packages in `dependencies` and tooling in `devDependencies`.
- Commit `package.json` and the lockfile, but ignore `node_modules` and secrets.
- Remember that CPU-heavy JavaScript blocks the event loop.
- Use events for notifications and streams for large or continuous data.
- Handle errors at every asynchronous boundary.

Reference: [Node.js official documentation](https://nodejs.org/docs/latest/api/)
