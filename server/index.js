import express from 'express'
import cors from 'cors'
import { Client } from '@notionhq/client'
import 'dotenv/config'

const app = express()
app.use(cors())

const notion = process.env.NOTION_TOKEN
  ? new Client({ auth: process.env.NOTION_TOKEN })
  : null

const DATABASE_ID = process.env.NOTION_DATABASE_ID

function pickProp(props, names) {
  for (const name of names) {
    const p = props[name]
    if (!p) continue
    if (p.type === 'title' && p.title?.length) return p.title.map((t) => t.plain_text).join('')
    if (p.type === 'rich_text' && p.rich_text?.length) return p.rich_text.map((t) => t.plain_text).join('')
    if (p.type === 'select') return p.select?.name || ''
    if (p.type === 'multi_select') return (p.multi_select || []).map((s) => s.name)
    if (p.type === 'date') return p.date?.start || p.date?.end || ''
    if (p.type === 'checkbox') return !!p.checkbox
    if (p.type === 'url') return p.url || ''
    if (p.type === 'number') return String(p.number ?? '')
    if (p.type === 'formula') return p.formula?.type === 'string' ? p.formula.string : ''
  }
  return undefined
}

function coverUrl(page) {
  const c = page.cover
  if (!c) return null
  if (c.type === 'external') return c.external?.url || null
  if (c.type === 'file') return c.file?.url || null
  return null
}

function mapPost(page) {
  const props = page.properties
  return {
    id: page.id,
    slug: pickProp(props, ['Slug']) || null,
    title: pickProp(props, ['Name', 'Title', 'name', 'title']) || 'Untitled',
    date: pickProp(props, ['Date', 'Published At', 'published']) || '',
    description: pickProp(props, ['Description', 'Summary', 'Excerpt']) || '',
    tags: pickProp(props, ['Tags', 'Tag', 'tags']) || [],
    published: pickProp(props, ['Published', 'published', 'Draft']) ?? true,
    cover: coverUrl(page),
    url: page.url,
    lastEdited: page.last_edited_time,
  }
}

// --- Rich text / block -> HTML renderer (safe, plain text + links) ---
function richTextHtml(rt) {
  return rt
    .map((t) => {
      const { annotations } = t
      let text = t.href
        ? `<a href="${escapeHtml(t.href)}" target="_blank" rel="noopener noreferrer" class="notion-link">${escapeHtml(t.plain_text)}</a>`
        : escapeHtml(t.plain_text)
      if (annotations?.bold) text = `<strong>${text}</strong>`
      if (annotations?.italic) text = `<em>${text}</em>`
      if (annotations?.underline) text = `<u>${text}</u>`
      if (annotations?.strikethrough) text = `<del>${text}</del>`
      if (annotations?.code) text = `<code>${text}</code>`
      return text
    })
    .join('')
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function blockToHtml(block) {
  const { type, has_children, id } = block
  switch (type) {
    case 'paragraph':
      return `<p>${richTextHtml(block.paragraph?.rich_text || [])}</p>`
    case 'heading_1':
      return `<h2>${richTextHtml(block.heading_1?.rich_text || [])}</h2>`
    case 'heading_2':
      return `<h3>${richTextHtml(block.heading_2?.rich_text || [])}</h3>`
    case 'heading_3':
      return `<h4>${richTextHtml(block.heading_3?.rich_text || [])}</h4>`
    case 'bulleted_list_item':
      return `<li>${richTextHtml(block.bulleted_list_item?.rich_text || [])}</li>`
    case 'numbered_list_item':
      return `<li>${richTextHtml(block.numbered_list_item?.rich_text || [])}</li>`
    case 'to_do':
      return `<p class="notion-todo">${block.to_do?.checked ? '☑ ' : '☐ '}${richTextHtml(block.to_do?.rich_text || [])}</p>`
    case 'toggle':
      return `<details><summary>${richTextHtml(block.toggle?.rich_text || [])}</summary>${childrenHtml(block, id)}</details>`
    case 'quote':
      return `<blockquote>${richTextHtml(block.quote?.rich_text || [])}</blockquote>`
    case 'code':
      return `<pre><code>${escapeHtml((block.code?.rich_text || []).map((t) => t.plain_text).join('\n'))}</code></pre>`
    case 'divider':
      return `<hr />`
    case 'callout':
      return `<div class="notion-callout">${richTextHtml(block.callout?.rich_text || [])}</div>`
    case 'image': {
      const src = block.image?.type === 'external' ? block.image.external?.url : block.image?.file?.url
      if (!src) return ''
      const cap = (block.image?.caption || []).map((t) => t.plain_text).join('')
      return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(cap)}" loading="lazy" /><figcaption>${cap}</figcaption></figure>`
    }
    case 'table':
      return '<div class="notion-table"></div>'
    default:
      return ''
  }
}

function childrenHtml(block, id) {
  // Placeholder; real children fetched separately when needed
  void id
  return ''
}

app.get('/api/posts', async (req, res) => {
  try {
    if (!process.env.NOTION_TOKEN) {
      return res.status(503).json({ error: 'NOTION_TOKEN not configured' })
    }
    if (!DATABASE_ID) {
      return res.status(503).json({ error: 'NOTION_DATABASE_ID not configured' })
    }
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: { property: 'Published', checkbox: { equals: true } },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })
    const posts = response.results.map(mapPost).filter((p) => p.published !== false)
    res.json({ posts })
  } catch (err) {
    console.error('Notion list error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/posts/:id', async (req, res) => {
  try {
    const id = req.params.id
    const page = await notion.pages.retrieve({ page_id: id })
    let blocks = []
    let cursor
    do {
      const r = await notion.blocks.children.list({ block_id: id, start_cursor: cursor })
      blocks = blocks.concat(r.results)
      cursor = r.has_more ? r.next_cursor : null
    } while (cursor)

    // Fetch children for container blocks (recursively, depth 2)
    async function resolve(bs, depth = 0) {
      if (depth > 2) return bs
      const out = []
      for (const b of bs) {
        if (b.has_children) {
          try {
            let childCursor
            const kids = []
            do {
              const r = await notion.blocks.children.list({ block_id: b.id, start_cursor: childCursor })
              kids.push(...r.results)
              childCursor = r.has_more ? r.next_cursor : null
            } while (childCursor)
            b.children = await resolve(kids, depth + 1)
          } catch {
            b.children = []
          }
        }
        out.push(b)
      }
      return out
    }
    blocks = await resolve(blocks)

    // Convert to HTML list, wrapping consecutive list items
    const html = renderBlocksToHtml(blocks)
    res.json({ post: mapPost(page), content: html, url: page.url })
  } catch (err) {
    console.error('Notion detail error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

function renderBlocksToHtml(blocks) {
  const out = []
  let inList = null
  let listTag = inList
  const flushList = () => {
    if (inList) {
      const tag = listTag
      out.push(`<${tag}>${inList.join('')}</${tag}>`)
      inList = null
      listTag = null
    }
  }
  for (const b of blocks) {
    const type = b.type
    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const tag = type === 'bulleted_list_item' ? 'ul' : 'ol'
      if (inList && listTag === tag) {
        inList.push(blockToHtml(b))
        continue
      }
      flushList()
      inList = [blockToHtml(b)]
      listTag = tag
      continue
    }
    flushList()
    const html = blockToHtml(b)
    if (html) out.push(html)
  }
  flushList()
  return out.join('\n')
}

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 8787
  app.listen(PORT, () => {
    console.log(`Devonyx server listening on http://localhost:${PORT}`)
  })
}

export default app