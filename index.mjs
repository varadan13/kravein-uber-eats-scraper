import { Queue } from "bullmq";
import { Worker } from "bullmq";
import IORedis from "ioredis";

import data from "./data.mjs";
import download from "./download.mjs";

const myQueue = new Queue("ubereatsScraper");

async function addJobs() {
  for (const dt of data) {
    await myQueue.add("ubereatsScraperJob", dt);
  }
}

await addJobs();

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker(
  "ubereatsScraper",
  async (job) => {
    // Will print { foo: 'bar'} for the first job
    // and { qux: 'baz' } for the second.
    await download(job.data);
    console.log(job.data);
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
