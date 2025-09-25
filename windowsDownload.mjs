const windowsDownload = async ({
  storeUuid,
  sectionUuid,
  subsectionUuid,
  menuItemUuid,
}) => {
  const options = {
    method: "POST",
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "no-cache",
      "content-type": "application/json",
      origin: "https://www.ubereats.com",
      pragma: "no-cache",
      priority: "u=1, i",
      referer:
        "https://www.ubereats.com/au/store/2-massi-de-munde-kebab/zIOkbMpiQKayA-T_1DnG-w?diningMode=PICKUP&mod=quickView&modctx=%257B%2522storeUuid%2522%253A%2522cc83a46c-ca62-40a6-b203-e4ffd439c6fb%2522%252C%2522sectionUuid%2522%253A%2522cd259b59-9540-4f30-9b9e-9a19828e825c%2522%252C%2522subsectionUuid%2522%253A%2522763672e4-2f96-4260-9226-5968d0a892a9%2522%252C%2522itemUuid%2522%253A%2522e56ea8ad-764e-46d2-b95e-329bd1d80ba0%2522%252C%2522showSeeDetailsCTA%2522%253Atrue%257D&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMjEwJTIwU3RhdGlvbiUyMFN0cmVldCUyMiUyQyUyMnJlZmVyZW5jZSUyMiUzQSUyMjFmYzc5MGQwLWU3Y2ItZjRlYS0wZGE1LWI2NjEzZTVlMTFjNiUyMiUyQyUyMnJlZmVyZW5jZVR5cGUlMjIlM0ElMjJ1YmVyX3BsYWNlcyUyMiUyQyUyMmxhdGl0dWRlJTIyJTNBLTM3Ljk4MjczMyUyQyUyMmxvbmdpdHVkZSUyMiUzQTE0NS4wNjY1MyU3RA%3D%3D&ps=1",
      "sec-ch-prefers-color-scheme": "dark",
      "sec-ch-ua":
        '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      "x-csrf-token": "x",
      "x-uber-client-gitref": "a376c93847fe38fad0a43bbbc0039b257e712b66",
      "x-uber-request-id": "98a9ad47-61b7-42ca-a1f8-b8f8ad9cdfc0",
      "x-uber-session-id": "04036688-88a9-4189-91ea-99e60e6a955d",
      cookie:
        'uev2.id.xp=71839816-2278-4af6-b16a-e558b719139f; dId=0ec51256-d83a-4e7a-87f7-e3399a860da9; uev2.diningMode=PICKUP; uev2.loc=%7B%22address%22%3A%7B%22address1%22%3A%2210%20Station%20Street%22%2C%22address2%22%3A%22Mentone%2C%20Melbourne%2C%20VIC%2C%203194%22%2C%22aptOrSuite%22%3A%22%22%2C%22eaterFormattedAddress%22%3A%2210%20Station%20Street%2C%20Mentone%2C%20VIC%203194%2C%20AU%22%2C%22subtitle%22%3A%22Mentone%2C%20Melbourne%2C%20VIC%2C%203194%22%2C%22title%22%3A%2210%20Station%20Street%22%2C%22uuid%22%3A%22%22%7D%2C%22latitude%22%3A-37.982733%2C%22longitude%22%3A145.06653%2C%22reference%22%3A%221fc790d0-e7cb-f4ea-0da5-b6613e5e11c6%22%2C%22referenceType%22%3A%22uber_places%22%2C%22type%22%3A%22uber_places%22%2C%22addressComponents%22%3A%7B%22city%22%3A%22Mentone%22%2C%22countryCode%22%3A%22AU%22%2C%22firstLevelSubdivisionCode%22%3A%22VIC%22%2C%22postalCode%22%3A%223194%22%7D%2C%22categories%22%3A%5B%22address_point%22%5D%2C%22originType%22%3A%22user_autocomplete%22%2C%22source%22%3A%22rev_geo_reference%22%2C%22userState%22%3A%22Unknown%22%7D; _ua={"session_id":"f2239a8a-15b4-4cca-91bc-e9cd70ceae9d","session_time_ms":1758790522056}; marketing_vistor_id=96956fbb-c56a-4b6d-b3ed-802ec8735e2a; uev2.embed_theme_preference=dark; u-cookie-prefs=eyJ2ZXJzaW9uIjoxMDAsImRhdGUiOjE3NTg3OTA1MjQyOTUsImNvb2tpZUNhdGVnb3JpZXMiOlsiYWxsIl0sImltcGxpY2l0Ijp0cnVlfQ%3D%3D; uev2.gg=true; utm_medium=undefined; utm_source=undefined; _scid=L-tyYqvskeszOo8cXnuP_RfwPuM4P4rk; _gcl_au=1.1.1882350836.1758790527; _yjsu_yjad=1758790526.32c99426-d460-4a27-947e-0e4b1610aed6; _fbp=fb.1.1758790526858.683648259124259650; _ga=GA1.1.1897168174.1758790528; _ScCbts=%5B%5D; _sctr=1%7C1758738600000; uev2.id.session=04036688-88a9-4189-91ea-99e60e6a955d; uev2.ts.session=1758794045009; jwt-session=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InNsYXRlLWV4cGlyZXMtYXQiOjE3NTg3OTU4NDUxMTd9LCJpYXQiOjE3NTg3OTA1MjIsImV4cCI6MTc1ODg3NjkyMn0.G6al_5U-t1OdnQZ7JV-P1YS3dy0F5yZR2jTGAb00xyw; utag_main__sn=2; utag_main_ses_id=1758794047102%3Bexp-session; utag_main__ss=0%3Bexp-session; utag_main__pn=2%3Bexp-session; _scid_r=OWtyYqvskeszOo8cXnuP_RfwPuM4P4rkGWOcPQ; utag_main__se=4%3Bexp-session; utag_main__st=1758796214734%3Bexp-session; _userUuid=; _uetsid=6164c48099ed11f0999795a4f4ee519a; _uetvid=6164f00099ed11f08a8d639f591cea91; _ga_P1RM71MPFP=GS2.1.s1758794052$o2$g1$t1758794415$j35$l0$h0',
    },
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
  };

  const res = await fetch(
    "https://www.ubereats.com/_p/api/getMenuItemV1?localeCode=au",
    options
  );
  const data = await res.json();

  return data;
};


export default windowsDownload