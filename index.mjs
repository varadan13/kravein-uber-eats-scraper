import { Queue } from "bullmq";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

import data from "./data.mjs";
import download from "./download.mjs";

const ubereatsQueue = new Queue("ubereatsScraper");

const queueCount = await ubereatsQueue.count();

let completedJob = 0;
let failedJob = 0;

async function addJobs() {
  for (const dt of data) {
    await ubereatsQueue.add("ubereatsScraperJob", dt);
  }
}

await addJobs();

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "ubereatsScraper",
  async (job) => {
    await download(job.data);
    console.log({ ...job.data, completedJob, failedJob, total: queueCount });
  },
  { connection }
);

function waitForAllJobs(worker, queue) {
  return new Promise(async (resolve) => {
    const total = await queue.count();
    worker.on("completed", () => {
      completedJob++;
      if (completedJob + failedJob === total) resolve();
    });
    worker.on("failed", () => {
      failedJob++;
      if (completedJob + failedJob === total) resolve();
    });
  });
}

async function generateCSV() {
  const dbDir = path.join(path.resolve(), "db");
  const outputDir = path.join(path.resolve(), "output");
  await mkdir(outputDir, { recursive: true });
  const files = await readdir(dbDir);
  const csvRows = ["itemname\n"];

  for (const file of files) {
    if (!file.endsWith(".uber.json")) continue;
    const content = await readFile(path.join(dbDir, file), "utf-8");
    try {
      const json = JSON.parse(content);
      const itemname = json?.data?.title;
      if (itemname) csvRows.push(`"${itemname.replace(/"/g, '""')}"\n`);
    } catch {}
  }

  const csvPath = path.join(outputDir, "items.csv");
  await writeFile(csvPath, csvRows.join(""), "utf-8");
  console.log("CSV file generated: " + csvPath);
}

await waitForAllJobs(worker, ubereatsQueue);

await generateCSV();
