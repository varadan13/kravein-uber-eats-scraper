function extractUberEatsContext(url) {
  const parsedUrl = new URL(url);
  const modctx = parsedUrl.searchParams.get("modctx");

  if (!modctx) return null;

  const onceDecoded = decodeURIComponent(modctx);
  const twiceDecoded = decodeURIComponent(onceDecoded);

  const context = JSON.parse(twiceDecoded);

  return {
    menuItemUuid: context.itemUuid,
    sectionUuid: context.sectionUuid,
    storeUuid: context.storeUuid,
    subsectionUuid: context.subsectionUuid,
  };
}

const download = async ({
  storeUuid,
  sectionUuid,
  subsectionUuid,
  menuItemUuid,
}) =>
  await fetch("https://www.ubereats.com/_p/api/getMenuItemV1", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
      pragma: "no-cache",
      priority: "u=1, i",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua":
        '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Linux"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-csrf-token": "x",
      "x-uber-client-gitref": "b89279c95112cff88f1758ac802961d1a82c5da1",
    },
    referrer:
      "https://www.ubereats.com/store/taco-bell-2400-n-main-st/3c7jjHP2TgCl39BNFqBWMg/a4565d4a-7ea0-541b-a61d-5cfd80b02811",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: JSON.stringify({
      itemRequestType: "ITEM",
      storeUuid,
      sectionUuid,
      subsectionUuid,
      menuItemUuid,
      cbType: "EATER_ENDORSED",
      contextReferences: [
        {
          type: "GROUP_ITEMS",
          payload: {
            type: "groupItemsContextReferencePayload",
            groupItemsContextReferencePayload: {
              catalogSectionUUID: "",
            },
          },
          pageContext: "STORE",
        },
      ],
    }),
    method: "POST",
    mode: "cors",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${menuItemUuid}.uber.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

const items = $$(".ia.r0.r1.lw.lx.ly.lz.p9 a").map((e) =>
  extractUberEatsContext(e.href)
);

for (let url of items) {
  download(url);
}
