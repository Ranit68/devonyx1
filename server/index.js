import "dotenv/config";
import express from "express";
import cors from "cors";
import { Client } from "@notionhq/client";

const app = express();
app.use(cors());
app.use(express.json());

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;
const port = process.env.PORT || 8787;

// Helpers
const plainText = (arr = []) => arr.map(t => t.plain_text).join("");

function coverUrl(coverProp) {
  // Cover is a Notion "Files" property
  const f = coverProp?.files?.[0];
  if (!f) return null;
  if (f.type === "external") return f.external.url;
  if (f.type === "file") return f.file.url; // signed URL (may expire)
  return null;
}

function mapPost(page) {
  const p = page.properties;

  return {
    id: page.id,
    name: plainText(p.Name?.title),
    slug: plainText(p.Slug?.rich_text),
    published: p.Published?.checkbox ?? false,
    featured: p.Featured?.checkbox ?? false,
    date: p.Date?.date?.start ?? null,
    description: plainText(p.Description?.rich_text),
    seoTitle: plainText(p["SEO Title"]?.rich_text),
    tags: (p.Tags?.multi_select ?? []).map(t => t.name),
    cover: coverUrl(p.Cover),
    lastEditedTime: page.last_edited_time,
  };
}

// GET /api/posts -> list published posts (optionally featured)
app.get("/api/posts", async (req, res) => {
  try {
    const isFeatured = req.query.featured === "true";
    
    const filterConditions = [
      { property: "Published", checkbox: { equals: true } }
    ];
    
    if (isFeatured) {
      filterConditions.push({ property: "Featured", checkbox: { equals: true } });
    }

    const result = await notion.dataSources.query({
      data_source_id: "3cb20033-0b6d-8061-81bd-000bb0f2243f",
      filter: filterConditions.length > 1 ? { and: filterConditions } : filterConditions[0],
      sorts: [{ property: "Date", direction: "descending" }],
    });

    res.json(result.results.map(mapPost));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/posts/:slug -> single published post + blocks
app.get("/api/posts/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const result = await notion.dataSources.query({
      data_source_id: "3cb20033-0b6d-8061-81bd-000bb0f2243f",
      filter: {
        and: [
          { property: "Published", checkbox: { equals: true } },
          { property: "Slug", rich_text: { equals: slug } },
        ],
      },
      page_size: 1,
    });

    const page = result.results[0];
    if (!page) return res.status(404).json({ error: "Not found" });

    // Fetch page content blocks
    const blocks = await notion.blocks.children.list({ block_id: page.id });

    res.json({
      ...mapPost(page),
      blocks: blocks.results,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Optional health check
app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.listen(port, async () => {
  console.log(`API running on http://localhost:${port}`);
//   console.log("SDK keys:", Object.keys(notion));
// // console.log("databases:", await notion.databases.retrieve({database_id: "3cb200330b6d804f903cdeab416b822e"}));
// console.log("\n\n\n")
// // console.log("databases:", await notion.dataSources.retrieve({data_source_id: "3cb20033-0b6d-8061-81bd-000bb0f2243f"}))
// // console.log("databases:", await notion.pages.retrieve({ page_id: "3cb20033-0b6d-807d-b74c-f937ddee58f0" }))
// // console.log("databases:", await notion.pages.retrieve({ page_id: "3cb20033-0b6d-807d-b74c-f937ddee58f0" }))
// console.log("databases:", await notion.blocks.children.list({ block_id: "3cb20033-0b6d-807d-b74c-f937ddee58f0", start_cursor: undefined, page_size: 50 }))

});