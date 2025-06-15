const axios = require("axios");
const fs = require("fs");

const BASE_URL = "https://safebooru.donmai.us/posts.json";
const TOTAL_PAGES = 1000; // Ganti sesuai kebutuhan
const POSTS_PER_PAGE = 100;
const BATCH_SIZE = 10;

const categorizedTagSet = {
  general: new Set(),
  artist: new Set(),
  character: new Set(),
  copyright: new Set(),
  meta: new Set()
};

async function fetchBatch(startPage, batchSize) {
  const batch = [];

  for (let i = 0; i < batchSize; i++) {
    const pageNum = startPage + i;
    if (pageNum > TOTAL_PAGES) break;

    batch.push(
      axios.get(BASE_URL, {
        params: {
          limit: POSTS_PER_PAGE,
          page: pageNum
        }
      }).then(res => ({ page: pageNum, data: res.data }))
        .catch(error => ({ page: pageNum, error }))
    );
  }

  const results = await Promise.allSettled(batch);

  for (const result of results) {
    if (result.status === "fulfilled" && result.value.data) {
      console.log(`✅ Page ${result.value.page} fetched`);

      for (const post of result.value.data) {
        const { tag_string, tag_string_artist, tag_string_character, tag_string_copyright, tag_string_meta } = post;

        tag_string?.split(" ").forEach(tag => categorizedTagSet.general.add(tag));
        tag_string_artist?.split(" ").forEach(tag => categorizedTagSet.artist.add(tag));
        tag_string_character?.split(" ").forEach(tag => categorizedTagSet.character.add(tag));
        tag_string_copyright?.split(" ").forEach(tag => categorizedTagSet.copyright.add(tag));
        tag_string_meta?.split(" ").forEach(tag => categorizedTagSet.meta.add(tag));
      }

    } else {
      const err = result.value?.error || result.reason;
      console.error(`❌ Page ${result.value?.page || "?"} failed: ${err}`);
    }
  }
}

async function main() {
  console.time("Total time");
  for (let i = 1; i <= TOTAL_PAGES; i += BATCH_SIZE) {
    await fetchBatch(i, BATCH_SIZE);
  }

  // Convert sets to arrays for output
  const output = Object.fromEntries(
    Object.entries(categorizedTagSet).map(([key, set]) => [key, Array.from(set)])
  );

  fs.writeFileSync("safebooru_tags.json", JSON.stringify(output, null, 2));
  console.log("✅ Tag data saved to safebooru_tags.json");
  console.timeEnd("Total time");
}

main();
