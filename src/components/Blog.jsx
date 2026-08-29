import { useCallback, useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../hooks'

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// ---- Normalize a post object from the API (supports both our fields and the server's) ----
function normalizePost(p) {
  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.title || p.name || 'Untitled',
    date: p.date || '',
    description: p.description || '',
    seoTitle: p.seoTitle || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    cover: p.cover || null,
    published: p.published !== false,
    blocks: Array.isArray(p.blocks) ? p.blocks : undefined,
  }
}

// ---- Render rich text (bold / italic / code / links / etc.) ----
function RichText({ value }) {
  return (
    <>
      {(value || []).map((t, i) => {
        const { annotations = {}, href } = t
        let node = <>{t.plain_text}</>
        if (href) {
          node = (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {t.plain_text}
            </a>
          )
        }
        if (annotations.bold) node = <strong>{node}</strong>
        if (annotations.italic) node = <em>{node}</em>
        if (annotations.underline) node = <u>{node}</u>
        if (annotations.strikethrough) node = <del>{node}</del>
        if (annotations.code) node = <code>{node}</code>
        return <span key={i}>{node}</span>
      })}
    </>
  )
}

// ---- Convert Notion blocks + children into React elements ----
function Blocks({ blocks, depth = 0 }) {
  if (!blocks || blocks.length === 0 || depth > 4) return null

  return (
    <div className={depth === 0 ? 'mt-2' : ''}>
      {blocks.map((block) => {
        const children = block.has_children ? <Blocks blocks={block.children || []} depth={depth + 1} /> : null
        const rt = (b) => b?.rich_text || []
        switch (block.type) {
          case 'paragraph':
            return (
              <p key={block.id}>{rt(block.paragraph) ? <RichText value={rt(block.paragraph)} /> : '\u00A0'}</p>
            )
          case 'heading_1':
            return <h2 key={block.id}><RichText value={rt(block.heading_1)} /></h2>
          case 'heading_2':
            return <h3 key={block.id}><RichText value={rt(block.heading_2)} /></h3>
          case 'heading_3':
            return <h4 key={block.id}><RichText value={rt(block.heading_3)} /></h4>
          case 'bulleted_list_item':
            return (
              <li key={block.id}>
                <RichText value={rt(block.bulleted_list_item)} />
                {children}
              </li>
            )
          case 'numbered_list_item':
            return (
              <li key={block.id}>
                <RichText value={rt(block.numbered_list_item)} />
                {children}
              </li>
            )
          case 'to_do':
            return (
              <p key={block.id} className="notion-todo">
                {block.to_do?.checked ? '☑' : '☐'}&nbsp;<RichText value={rt(block.to_do)} />
              </p>
            )
          case 'toggle':
            return (
              <details key={block.id}>
                <summary><RichText value={rt(block.toggle)} /></summary>
                {children}
              </details>
            )
          case 'quote':
            return <blockquote key={block.id}><RichText value={rt(block.quote)} /></blockquote>
          case 'code':
            return (
              <pre key={block.id}>
                <code>{rt(block.code).map((t) => t.plain_text).join('')}</code>
              </pre>
            )
          case 'divider':
            return <hr key={block.id} />
          case 'callout':
            return (
              <div key={block.id} className="notion-callout">
                <RichText value={rt(block.callout)} />
              </div>
            )
          case 'image': {
            const img = block.image
            const src = img?.type === 'external' ? img.external?.url : img?.file?.url
            if (!src) return null
            return (
              <figure key={block.id}>
                <img src={src} alt={img?.caption?.map((c) => c.plain_text).join('') || ''} loading="lazy" />
                {img?.caption?.length > 0 && <figcaption>{img.caption.map((c) => c.plain_text).join('')}</figcaption>}
              </figure>
            )
          }
          case 'child_page':
            return null
          default:
            return null
        }
      })}
    </div>
  )
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [post, setPost] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (cancelled) return
        if (Array.isArray(data)) {
          setPosts(data.filter((p) => p.published).map(normalizePost))
        } else if (data.posts) {
          setPosts(data.posts.filter((p) => p.published).map(normalizePost))
        } else if (data.error) {
          setError(data.error)
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Could not load posts')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openPost = useCallback(async (slug) => {
    setSelected(slug)
    setPost(null)
    setContentLoading(true)
    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(slug)}`)
      if (!res.ok) throw new Error(`Server responded ${res.status}`)
      const data = await res.json()
      if (data.error) {
        setError(data.error)
      } else {
        setPost(normalizePost(data))
      }
    } catch (err) {
      setError(err.message || 'Could not load post')
    } finally {
      setContentLoading(false)
    }
  }, [])

  const goBack = () => {
    setSelected(null)
    setPost(null)
    setError('')
  }

  return (
    <section id="blog" className="section bg-white">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <span className="eyebrow">Blog</span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="mt-5 text-balance font-display text-4xl font-medium tracking-tight text-ink md:text-5xl">
                Notes from the <span className="serif-accent text-brand-dark">studio</span>.
              </h2>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-5 text-lg text-ink-soft">
                Design, engineering, and growth deep-dives — published from Notion,
                live here instantly.
              </p>
            </Reveal>
          </div>
        </div>

        {selected ? (
          <article className="mx-auto mt-12 max-w-3xl">
            <button
              onClick={goBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" /> All posts
            </button>
            {contentLoading && <p className="mt-8 text-ink-muted">Loading post…</p>}
            {error && !contentLoading && <p className="mt-8 text-sm text-ink-soft">{error}</p>}
            {post && (
              <>
                <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
                  {post.title}
                </h3>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                  {post.date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" /> {formatDate(post.date)}
                    </span>
                  )}
                  {post.tags.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> {post.tags.join(', ')}
                    </span>
                  )}
                </p>
                {post.cover && (
                  <img
                    src={post.cover}
                    alt={post.title}
                    className="mt-8 h-64 w-full rounded-2xl border border-hairline object-cover"
                  />
                )}
                {post.description && (
                  <p className="mt-6 font-display text-xl italic text-ink-soft">{post.description}</p>
                )}
                <div className="notion-body mt-8">
                  {post.blocks?.length ? (
                    <Blocks blocks={post.blocks} />
                  ) : (
                    <p className="text-ink-muted">This post has no content yet.</p>
                  )}
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
                  <button
                    onClick={goBack}
                    className="text-sm font-medium text-ink-muted transition-colors hover:text-brand"
                  >
                    Back to all posts
                  </button>
                </div>
              </>
            )}
          </article>
        ) : (
          <div className="mt-12">
            {loading && <p className="text-ink-muted">Loading posts…</p>}
            {error && !loading && (
              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-sm text-ink-soft">
                Couldn't load posts.{' '}
                <span className="font-mono text-xs">{error}</span>
              </div>
            )}
            {!loading && !error && posts.length === 0 && (
              <div className="rounded-2xl border border-hairline bg-surface p-8 text-center text-sm text-ink-muted">
                No published posts yet. Publish a post in your Notion database and it will appear here.
              </div>
            )}
            {!loading && posts.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((p, i) => (
                  <Reveal key={p.id} delay={i * 80}>
                    <button
                      onClick={() => openPost(p.slug)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface text-left shadow-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
                    >
                      {p.cover && (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={p.cover}
                            alt={p.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs text-ink-muted">
                          {p.date && (
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(p.date)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2.5 font-display text-xl font-medium leading-snug text-ink">
                          {p.title}
                        </h3>
                        {p.description && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.description}</p>
                        )}
                        {p.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-brand/10 px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-brand-dark"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-dark transition-colors group-hover:text-brand">
                          Read article{' '}
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
            <div className="mt-12 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
              >
                <ArrowLeft className="h-4 w-4" /> Back to home
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}