import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowUpRight, CalendarDays, FileText, ExternalLink } from 'lucide-react'
import { Reveal } from '../hooks'

function formatDate(d) {
  if (!d) return ''
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)
  const [content, setContent] = useState(null)
  const [contentLoading, setContentLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/posts')
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setPosts(data.posts || [])
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

  const openPost = (id) => {
    setSelected(id)
    setContent(null)
    setContentLoading(true)
    fetch(`/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded ${res.status}`)
        return res.json()
      })
      .then((data) => setContent(data))
      .catch((err) => setError(err.message || 'Could not load post'))
      .finally(() => setContentLoading(false))
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
          <Reveal delay={250}>
            <a
              href="https://scandalous-alfalfa-550.notion.site/3cb200330b6d804f903cdeab416b822e?v=3cb200330b6d80a69f3d000cefcc6171"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-full border border-hairline bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-brand hover:text-brand"
            >
              Open in Notion <ExternalLink className="h-4 w-4" />
            </a>
          </Reveal>
        </div>

        {selected ? (
          <article className="mx-auto mt-12 max-w-3xl">
            <button
              onClick={() => setSelected(null)}
              className="inline-flex items-center gap-2 text-sm font-medium text-ink-muted transition-colors hover:text-brand"
            >
              <ArrowLeft className="h-4 w-4" /> All posts
            </button>
            {contentLoading && <p className="mt-8 text-ink-muted">Loading post…</p>}
            {content && (
              <>
                <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
                  {content.post.title}
                </h3>
                <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                  {content.post.date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" /> {formatDate(content.post.date)}
                    </span>
                  )}
                  {content.post.tags?.length > 0 && (
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> {content.post.tags.join(', ')}
                    </span>
                  )}
                </p>
                {content.post.cover && (
                  <img
                    src={content.post.cover}
                    alt={content.post.title}
                    className="mt-8 h-64 w-full rounded-2xl border border-hairline object-cover"
                  />
                )}
                <div
                  className="notion-body mt-8"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
                <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-hairline pt-6">
                  <a
                    href={content.post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-dark hover:text-brand"
                  >
                    Read on Notion <ArrowUpRight className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => setSelected(null)}
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
            {error && (
              <div className="rounded-2xl border border-accent/30 bg-accent/10 p-6 text-sm text-ink-soft">
                Couldn't load posts.{" "}
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
                {posts.map((post, i) => (
                  <Reveal key={post.id} delay={i * 80}>
                    <button
                      onClick={() => openPost(post.id)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-3xl border border-hairline bg-surface text-left shadow-sm transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
                    >
                      {post.cover && (
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={post.cover}
                            alt={post.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-2 text-xs text-ink-muted">
                          {post.date && (
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(post.date)}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-2.5 font-display text-xl font-medium leading-snug text-ink">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                            {post.description}
                          </p>
                        )}
                        {post.tags?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-brand/10 px-2.5 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-brand-dark"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-dark transition-colors group-hover:text-brand">
                          Read article <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>
                      </div>
                    </button>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}