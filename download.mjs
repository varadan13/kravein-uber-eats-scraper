import fetch from "node-fetch";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import windowsDownload from "./windowsDownload.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "db");
const outputDir2 = path.join(__dirname, "db.processed");

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

await mkdir(outputDir, { recursive: true });
await mkdir(outputDir2, { recursive: true });

const iterateArray = (arr, func) => {
  const temp = [];

  arr.forEach((ele) => {
    temp.push(func(ele));
  });

  return temp;
};

const iterate = (obj) => {
  const t = {};
  Object.keys(obj).forEach((key) => {
    if (key === "title") {
      t.title = obj[key];
    }

    if (key === "uuid") {
      t.uuid = obj[key];
    }

    if (key === "price") {
      t.price = obj[key];
    }

    if (key.includes("subtitle") || key.includes("itemAttributeInfo")) {
      // pass
    } else if (Array.isArray(obj[key]) && obj[key].length !== 0) {
      t[key] = iterateArray(obj[key], iterate);
    } else if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      Object.keys(obj[key]).length !== 0
    ) {
      t[key] = iterate(obj[key]);
    }
  });

  if (t.price) {
    // pass
  } else {
    t.price = null;
  }

  return t;
};

const download = async ({
  storeUuid,
  sectionUuid,
  subsectionUuid,
  menuItemUuid,
}) => {
  try {
    //     const command = `
    // curl 'https://www.ubereats.com/_p/api/getMenuItemV1?localeCode=au' \
    //   -H 'accept: */*' \
    //   -H 'accept-language: en-US,en;q=0.9' \
    //   -H 'cache-control: no-cache' \
    //   -H 'content-type: application/json' \
    //   -b 'dId=39ca1c58-eb90-4d74-9bc8-bdcd79ccb094; marketing_vistor_id=9802fa39-d8cc-417c-a881-70c2ce4c33a3; u-cookie-prefs=eyJ2ZXJzaW9uIjoxMDAsImRhdGUiOjE3NDc5MDg5NjQ5OTcsImNvb2tpZUNhdGVnb3JpZXMiOlsiYWxsIl0sImltcGxpY2l0Ijp0cnVlfQ%3D%3D; uev2.gg=true; _scid=4aCIKRD9E7xbW1YeYQsFEhu1RKcUqZth; _gcl_au=1.1.175552750.1747908966; _fbp=fb.1.1747908965831.159345655563563755; _yjsu_yjad=1747908965.82a107bc-bac7-4d7f-9a24-1c4175a46877; _ga=GA1.1.858510760.1747908966; uev2.embed_theme_preference=dark; uev2.id.xp=921641c8-487c-4539-a0fc-c1ad9236e49c; _ua={"session_id":"597d9bc0-2666-4505-a608-75de3a154b07","session_time_ms":1751358537223}; utm_medium=undefined; utm_source=undefined; uev2.diningMode=DELIVERY; _sctr=1%7C1751913000000; uev2.id.session=3d3882f9-ffac-4d37-811d-569743b33613; uev2.ts.session=1751965430693; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNsYXRlLWV4cGlyZXMtYXQiOjE3NTE5NjcyMzA3ODN9LCJpYXQiOjE3NTE4ODc3NDYsImV4cCI6MTc1MTk3NDE0Nn0.E0i4xgqNQfkGoNMPl4nq1D346HFu05xJKkAGZhg3Gig; utag_main__sn=11; utag_main_ses_id=1751965433497%3Bexp-session; utag_main__pn=1%3Bexp-session; _scid_r=ByCIKRD9E7xbW1YeYQsFEhu1RKcUqZthLPMSqQ; utag_main__se=2%3Bexp-session; utag_main__ss=0%3Bexp-session; utag_main__st=1751967237834%3Bexp-session; _userUuid=; _uetsid=9a034fa05b2511f09634192c4bbcc471; _uetvid=c58f1fb036f511f0a3e457e3bd0a551d; _ScCbts=%5B%5D; _ga_P1RM71MPFP=GS2.1.s1751965440$o11$g1$t1751965440$j60$l0$h0; _clck=hdv0sx%7C2%7Cfxf%7C0%7C1968' \
    //   -H 'origin: https://www.ubereats.com' \
    //   -H 'pragma: no-cache' \
    //   -H 'priority: u=1, i' \
    //  -H 'referer: https://www.ubereats.com/au/store/village-birdhouse/LTbF37rfT-2JxzKE_kQw_Q?mod=quickView&modctx=%257B%2522storeUuid%2522%253A%25222d36c5df-badf-4fed-89c7-3284fe4430fd%2522%252C%2522sectionUuid%2522%253A%25220846752d-4bd7-51f1-bf2d-69cb0d26a336%2522%252C%2522subsectionUuid%2522%253A%2522513a59b1-ed6f-5950-a64f-1e2acccfcfc2%2522%252C%2522itemUuid%2522%253A%25229d13e88b-a0bd-5944-8f36-d820d409a00f%2522%252C%2522showSeeDetailsCTA%2522%253Atrue%257D&ps=1' \
    //   -H 'sec-ch-prefers-color-scheme: dark' \
    //   -H 'sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"' \
    //   -H 'sec-ch-ua-mobile: ?0' \
    //   -H 'sec-ch-ua-platform: "Linux"' \
    //   -H 'sec-fetch-dest: empty' \
    //   -H 'sec-fetch-mode: cors' \
    //   -H 'sec-fetch-site: same-origin' \
    //   -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36' \
    //   -H 'x-csrf-token: x' \
    //   -H 'x-uber-client-gitref: b89279c95112cff88f1758ac802961d1a82c5da1' \
    //   --data-raw '{"itemRequestType":"ITEM","storeUuid":"${storeUuid}","sectionUuid":"${sectionUuid}","subsectionUuid":"${subsectionUuid}","menuItemUuid":"${menuItemUuid}","cbType":"EATER_ENDORSED","contextReferences":[{"type":"GROUP_ITEMS","payload":{"type":"groupItemsContextReferencePayload","groupItemsContextReferencePayload":{"catalogSectionUUID":""}},"pageContext":"STORE"}]}'
    //   `;
    //     const { stdout } = await execAsync(command);

    //     const parseData = JSON.parse(stdout);

    const stdout = await windowsDownload({
      storeUuid,
      sectionUuid,
      subsectionUuid,
      menuItemUuid,
    });

    const parseData = stdout;

    const tempList = iterateArray(parseData?.data?.customizationsList, iterate);

    const stdOut2 = {};
    stdOut2.itemname = parseData?.data?.title;
    stdOut2.uuid = parseData?.data?.uuid;
    stdOut2.price = parseData?.data?.price;
    stdOut2.options = tempList;

    const filePath1 = path.resolve(outputDir, `${menuItemUuid}.uber.json`);
    const filePath2 = path.resolve(
      outputDir2,
      `${menuItemUuid}.processed.uber.json`
    );
    await writeFile(filePath1, JSON.stringify(stdout), "utf-8");
    await writeFile(filePath2, JSON.stringify(stdOut2), "utf-8");
    console.log(`✅ File saved: ${filePath1}`);
    console.log(`✅ File saved: ${filePath2}`);
  } catch (err) {
    console.error("❌ Curl failed:", err.stderr || err.message);
  }
};

export default download;
