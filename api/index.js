import "dotenv/config";
import express from "express";
import cors from "cors";
import { Client } from "@notionhq/client";

const app = express();

app.use(cors());
app.use(express.json());

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const databaseId = process.env.NOTION_DATABASE_ID;

const plainText = (arr = []) =>
  arr.map((t) => t.plain_text).join("");

function coverUrl(coverProp) {
  const f = coverProp?.files?.[0];

  if (!f) return null;

  if (f.type === "external") {
    return f.external.url;
  }

  if (f.type === "file") {
    return f.file.url;
  }

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
    tags: (p.Tags?.multi_select ?? []).map((t) => t.name),
    cover: coverUrl(p.Cover),
    lastEditedTime: page.last_edited_time,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    notionToken: !!process.env.NOTION_TOKEN,
    databaseId: !!process.env.NOTION_DATABASE_ID,
  });
});

app.get("/api/posts", async (req, res) => {
  try {
    const isFeatured = req.query.featured === "true";

    const filterConditions = [
      {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
    ];

    if (isFeatured) {
      filterConditions.push({
        property: "Featured",
        checkbox: {
          equals: true,
        },
      });
    }

    const result = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID,
      filter:
        filterConditions.length > 1
          ? { and: filterConditions }
          : filterConditions[0],
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    res.json(result.results.map(mapPost));
  } catch (err) {
    console.error("GET /api/posts error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/posts/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const result = await notion.dataSources.query({
      data_source_id: process.env.NOTION_DATA_SOURCE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
      page_size: 1,
    });

    const page = result.results[0];

    if (!page) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    const blocks = await notion.blocks.children.list({
      block_id: page.id,
    });

    res.json({
      ...mapPost(page),
      blocks: blocks.results,
    });
  } catch (err) {
    console.error("GET /api/posts/:slug error:", err);

    res.status(500).json({
      error: err.message,
    });
  }
});

export default app;
