import fetch from "node-fetch";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "jsons");

import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

await mkdir(outputDir, { recursive: true });

const download = async ({
  storeUuid,
  sectionUuid,
  subsectionUuid,
  menuItemUuid,
}) => {
  try {
    const command = `
curl 'https://www.ubereats.com/_p/api/getMenuItemV1?localeCode=au' \
  -H 'accept: */*' \
  -H 'accept-language: en-US,en;q=0.9' \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -b 'dId=39ca1c58-eb90-4d74-9bc8-bdcd79ccb094; marketing_vistor_id=9802fa39-d8cc-417c-a881-70c2ce4c33a3; u-cookie-prefs=eyJ2ZXJzaW9uIjoxMDAsImRhdGUiOjE3NDc5MDg5NjQ5OTcsImNvb2tpZUNhdGVnb3JpZXMiOlsiYWxsIl0sImltcGxpY2l0Ijp0cnVlfQ%3D%3D; uev2.gg=true; _scid=4aCIKRD9E7xbW1YeYQsFEhu1RKcUqZth; _gcl_au=1.1.175552750.1747908966; _fbp=fb.1.1747908965831.159345655563563755; _yjsu_yjad=1747908965.82a107bc-bac7-4d7f-9a24-1c4175a46877; _ga=GA1.1.858510760.1747908966; uev2.embed_theme_preference=dark; uev2.id.xp=921641c8-487c-4539-a0fc-c1ad9236e49c; _ua={"session_id":"597d9bc0-2666-4505-a608-75de3a154b07","session_time_ms":1751358537223}; utm_medium=undefined; utm_source=undefined; _ScCbts=%5B%5D; uev2.diningMode=DELIVERY; _clck=hdv0sx%7C2%7Cfxe%7C0%7C1968; uev2.id.session=96ccae63-4b2e-4757-849a-7913e7ada2e4; uev2.ts.session=1751918142361; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNsYXRlLWV4cGlyZXMtYXQiOjE3NTE5MTk5NDI0MjR9LCJpYXQiOjE3NTE4ODc3NDYsImV4cCI6MTc1MTk3NDE0Nn0.LP200LLCj4JfUdz2c0_THRJZAtgmmv2ZAipa6EPwxiw; utag_main__sn=9; utag_main_ses_id=1751918145159%3Bexp-session; utag_main__ss=0%3Bexp-session; _sctr=1%7C1751913000000; utag_main__pn=3%3Bexp-session; _userUuid=; _scid_r=BiCIKRD9E7xbW1YeYQsFEhu1RKcUqZthLPMSqA; utag_main__se=10%3Bexp-session; utag_main__st=1751920561177%3Bexp-session; _ga_P1RM71MPFP=GS2.1.s1751918165$o10$g1$t1751918761$j60$l0$h0; _uetsid=9a034fa05b2511f09634192c4bbcc471; _uetvid=c58f1fb036f511f0a3e457e3bd0a551d' \
  -H 'origin: https://www.ubereats.com' \
  -H 'pragma: no-cache' \
  -H 'priority: u=1, i' \
  -H 'referer: https://www.ubereats.com/au/store/u-tong-thai-vegan-restaurant/1YfGPqpgX-6vYeUoAT-HXw?mod=quickView&modctx=%257B%2522storeUuid%2522%253A%2522d587c63e-aa60-5fee-af61-e528013f875f%2522%252C%2522sectionUuid%2522%253A%252280f7ad28-910e-453b-9a7d-25381d824fe0%2522%252C%2522subsectionUuid%2522%253A%252217fa05e1-af6b-487e-a1e3-ca87265d41d1%2522%252C%2522itemUuid%2522%253A%2522fd50b92b-6949-40e6-9cad-4e831767ce1a%2522%252C%2522showSeeDetailsCTA%2522%253Atrue%257D&ps=1' \
  -H 'sec-ch-prefers-color-scheme: dark' \
  -H 'sec-ch-ua: "Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "Linux"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: same-origin' \
  -H 'user-agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36' \
  -H 'x-csrf-token: x' \
  -H 'x-uber-client-gitref: b89279c95112cff88f1758ac802961d1a82c5da1' \
  --data-raw '{"itemRequestType":"ITEM","storeUuid":"${storeUuid}","sectionUuid":"${sectionUuid}","subsectionUuid":"${subsectionUuid}","menuItemUuid":"${menuItemUuid}","cbType":"EATER_ENDORSED","contextReferences":[{"type":"GROUP_ITEMS","payload":{"type":"groupItemsContextReferencePayload","groupItemsContextReferencePayload":{"catalogSectionUUID":""}},"pageContext":"STORE"}]}'
  `;
    const { stdout } = await execAsync(command);

    const filePath = path.resolve(outputDir, `${menuItemUuid}.uber.json`);
    await writeFile(filePath, stdout, "utf-8");
    console.log(`✅ File saved: ${filePath}`);
  } catch (err) {
    console.error("❌ Curl failed:", err.stderr || err.message);
  }
};

export default download;
