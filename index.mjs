import { Queue } from "bullmq";
import { Worker } from "bullmq";
import IORedis from "ioredis";
import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

import data from "./data.mjs";
import download from "./download.mjs";

const ubereatsQueue = new Queue("ubereatsScraper2");

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
  "ubereatsScraper2",
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
  const csvRows = ["id,itemname,price\n"];

  for (const file of files) {
    if (!file.endsWith(".uber.json")) continue;
    const content = await readFile(path.join(dbDir, file), "utf-8");
    try {
      const json = JSON.parse(content);
      const itemname = json?.data?.title;
      const uuid = json?.data?.uuid;
      const price = json?.data?.price;
      if (itemname)
        csvRows.push(`${uuid},"${itemname.replace(/"/g, '""')}",${price}\n`);
    } catch {}
  }
  const csvPath = path.join(outputDir, "items.csv");
  await writeFile(csvPath, csvRows.join(""), "utf-8");
  console.log("📂 CSV file generated: " + csvPath);
}

async function generateProcessedCSV() {
  const dbProcessedDir = path.join(path.resolve(), "db.processed");
  const outputDir = path.join(path.resolve(), "output");
  await mkdir(outputDir, { recursive: true });

  try {
    const files = await readdir(dbProcessedDir);
    const csvRows = [
      "itemname,item_uuid,item_price,customization_title,option_title,option_price,option_uuid\n",
    ];

    for (const file of files) {
      if (!file.endsWith(".processed.uber.json")) continue;
      const content = await readFile(path.join(dbProcessedDir, file), "utf-8");
      try {
        const itemData = JSON.parse(content);

        const itemname = itemData.itemname;
        const itemUuid = itemData.uuid;
        const itemPrice = itemData.price;

        if (itemData.options && Array.isArray(itemData.options)) {
          for (const customization of itemData.options) {
            const customizationTitle = customization.title;
            const customizationUuid = customization.uuid;

            if (customization.options && Array.isArray(customization.options)) {
              for (const option of customization.options) {
                const optionTitle = option.title;
                const optionPrice = option.price;
                const optionUuid = option.uuid;

                csvRows.push(
                  `"${itemname.replace(
                    /"/g,
                    '""'
                  )}","${itemUuid}",${itemPrice},"${customizationTitle.replace(
                    /"/g,
                    '""'
                  )}","${optionTitle.replace(/"/g, '""')}",${
                    optionPrice || ""
                  },"${optionUuid}"\n`
                );

                if (
                  option.childCustomizationList &&
                  Array.isArray(option.childCustomizationList)
                ) {
                  for (const childCustomization of option.childCustomizationList) {
                    const childTitle = childCustomization.title;
                    const childUuid = childCustomization.uuid;

                    if (
                      childCustomization.options &&
                      Array.isArray(childCustomization.options)
                    ) {
                      for (const childOption of childCustomization.options) {
                        const childOptionTitle = childOption.title;
                        const childOptionPrice = childOption.price;
                        const childOptionUuid = childOption.uuid;

                        csvRows.push(
                          `"${itemname.replace(
                            /"/g,
                            '""'
                          )}","${itemUuid}",${itemPrice},"${childTitle.replace(
                            /"/g,
                            '""'
                          )}","${childOptionTitle.replace(/"/g, '""')}",${
                            childOptionPrice || ""
                          },"${childOptionUuid}"\n`
                        );
                      }
                    }
                  }
                }
              }
            }
          }
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err.message);
      }
    }

    const csvPath = path.join(outputDir, "customizations.csv");
    await writeFile(csvPath, csvRows.join(""), "utf-8");
    console.log("📂 Processed CSV file generated: " + csvPath);
  } catch (err) {
    console.error("Error reading db.processed directory:", err.message);
  }
}

await waitForAllJobs(worker, ubereatsQueue);

await generateCSV();
await generateProcessedCSV();
