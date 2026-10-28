import { posts } from '../data/posts'

export default function PostGrid({ limit, items: supplied }) {
  const items = supplied ?? (typeof limit === 'number' ? posts.slice(0, limit) : posts)

  return (
    <div className='blog-cms-wrapper'>
      <div className='blog-collection-list-wrapper w-dyn-list'>
        <div role='list' className='blog-collection-list w-dyn-items'>
          {items.map((post) => (
            <div role='listitem' key={post.slug} className='blog-collection-item w-dyn-item'>
              <a href={`/blog/${post.slug}`} className='blog-wrapper blog-card-modular w-inline-block'>
                <div className='blog-image-wrap'>
                  <img src={post.image} loading='lazy' alt={post.title} className='blog-image' />
                  <div className='blog-card-badges'>
                    {post.category && (
                      <span className='blog-badge-category'>{post.category}</span>
                    )}
                    <span className='blog-badge-date'>
                      {post.month ? `${post.date} ${post.month}` : post.date}
                    </span>
                  </div>
                </div>
                <div className='blog-content-wrapper'>
                  <h3 className='blog-card-title'>{post.title}</h3>
                  {post.excerpt && (
                    <p className='blog-card-excerpt'>{post.excerpt}</p>
                  )}
                  <div className='blog-card-footer'>
                    <span className='blog-read-time'>
                      <svg width='13' height='13' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <circle cx='12' cy='12' r='10' />
                        <polyline points='12 6 12 12 16 14' />
                      </svg>
                      {'3 min read'}
                    </span>
                    <span className='blog-card-action'>
                      <span>{'Read Article'}</span>
                      <span className='blog-card-arrow' aria-hidden='true'>{'→'}</span>
                    </span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
