import { readdir, readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

async function generateCSV() {
  const dbDir = path.join(path.resolve(), "db");
  const outputDir = path.join(path.resolve(), "output");
  await mkdir(outputDir, { recursive: true });
  const files = await readdir(dbDir);
  const csvRows = ["id,itemname,price,popular,itemDescription,imageUrl\n"];

  let i = 1;
  for (const file of files) {
    i++;
    if (!file.endsWith(".uber.json")) continue;
    const content = await readFile(path.join(dbDir, file), "utf-8");
    try {
      const json = JSON.parse(content);
      const itemname = json?.data?.title;
      const uuid = json?.data?.uuid;
      const price = json?.data?.price;
      const itemDescription = json?.data?.itemDescription;
      const imageUrl = json?.data?.imageUrl || "";
      const popular = !!json?.data?.endorsement;

      csvRows.push(
        `${uuid},"${itemname.replace(
          /"/g,
          '""'
        )}",${price},${popular},"${itemDescription.replace(
          /"/g,
          '""'
        )}","${imageUrl.replace(/"/g, '""')}"\n`
      );
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

await generateCSV();
await generateProcessedCSV();
