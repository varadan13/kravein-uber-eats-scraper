fetch("https://www.ubereats.com/_p/api/getMenuItemV1?localeCode=au", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-prefers-color-scheme": "dark",
    "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-csrf-token": "x",
    "x-uber-client-gitref": "b89279c95112cff88f1758ac802961d1a82c5da1"
  },
  "referrer": "https://www.ubereats.com/au/store/guzman-y-gomez-linden-park/eApw6FJ2XjKVlfJMmlcoTw?mod=quickView&modctx=%257B%2522storeUuid%2522%253A%2522780a70e8-5276-5e32-9595-f24c9a57284f%2522%252C%2522sectionUuid%2522%253A%25221baf9fe2-6353-5423-8514-3d910b07f163%2522%252C%2522subsectionUuid%2522%253A%25223f5589c5-d3ed-5c1a-8c67-dc151a82a365%2522%252C%2522itemUuid%2522%253A%25222fbc4396-d43d-55ac-a897-80fa82e0d925%2522%252C%2522showSeeDetailsCTA%2522%253Atrue%257D&ps=1&surfaceName=",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": "{\"itemRequestType\":\"ITEM\",\"storeUuid\":\"780a70e8-5276-5e32-9595-f24c9a57284f\",\"sectionUuid\":\"1baf9fe2-6353-5423-8514-3d910b07f163\",\"subsectionUuid\":\"3f5589c5-d3ed-5c1a-8c67-dc151a82a365\",\"menuItemUuid\":\"2fbc4396-d43d-55ac-a897-80fa82e0d925\",\"cbType\":\"EATER_ENDORSED\",\"contextReferences\":[{\"type\":\"GROUP_ITEMS\",\"payload\":{\"type\":\"groupItemsContextReferencePayload\",\"groupItemsContextReferencePayload\":{\"catalogSectionUUID\":\"\"}},\"pageContext\":\"STORE\"}]}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});