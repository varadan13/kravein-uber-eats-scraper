import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

async function generateCSV() {
  const dbDir = path.join(path.resolve(), "db");
  const outputDir = path.join(path.resolve(), "output");
  await mkdir(outputDir, { recursive: true });
  const files = await readdir(dbDir);
  const csvRows = ["id,itemname\n"];

  for (const file of files) {
    if (!file.endsWith(".uber.json")) continue;
    const content = await readFile(path.join(dbDir, file), "utf-8");
    try {
      const json = JSON.parse(content);
      const itemname = json?.data?.title;
      const uuid = json?.data?.uuid;
      if (itemname) csvRows.push(`${uuid},"${itemname.replace(/"/g, '""')}"\n`);
    } catch {}
  }

  const csvPath = path.join(outputDir, "items.csv");
  await writeFile(csvPath, csvRows.join(""), "utf-8");
  console.log("CSV file generated: " + csvPath);
}

await generateCSV();
