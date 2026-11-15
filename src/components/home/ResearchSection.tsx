import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type Post = { slug: string; title: string; excerpt: string; category?: string; source?: string; publishedAt?: string; readTime?: string | number };

export function ResearchSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  useEffect(() => {
    fetch('/blog/posts.json')
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setPosts(d.filter((p: Post & { status?: string }) => (p.status || 'published') === 'published').slice(0, 3)))
      .catch(() => {});
  }, []);
  if (!posts.length) return null;
  return (
    <section className="wrap lp-reveal">
      <div className="section-head">
        <div><span className="eyebrow">LoLaBo research desk</span><h2>Engineering notes & deep dives.</h2></div>
        <p>Peer-reviewed by LoLaBo before they go public. Only posts that pass the quality gate are published.</p>
      </div>
      <div className="lp-research">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="lp-post">
            <span className="meta">{p.source === 'ai-agent' ? 'LoLaBo · ' : ''}{p.category || 'Notes'}{p.readTime ? ` · ${p.readTime} min` : ''}</span>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
          </Link>
        ))}
      </div>
      <p className="lp-note"><Link to="/blog" style={{ color: 'var(--mint)' }}>Read all posts →</Link></p>
    </section>
  );
}
