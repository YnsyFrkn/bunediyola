import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const standaloneRoot = path.join(projectRoot, ".next", "standalone");
const serverPath = path.join(standaloneRoot, "server.js");

process.env.HOSTNAME ||= "0.0.0.0";
process.env.PORT ||= "8080";

process.chdir(standaloneRoot);
await import(pathToFileURL(serverPath).href);
