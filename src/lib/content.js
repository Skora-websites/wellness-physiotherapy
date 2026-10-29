import { useEffect, useState } from 'react'
import { services as bundledServices } from '../data/services'
import { posts as bundledPosts } from '../data/posts'
import { CLINIC_INFO } from '../data/clinic'
import { SERVICE_DETAIL, BLOG_DETAIL } from '../data/detailContent'

// Content edited in /admin comes from the API. When the API is unavailable
// (static deploy, offline) the bundled seed data keeps the site rendering.
let state = { loaded: false }
let pending = false
const listeners = new Set()

const normalizeService = (service) => {
  const html = typeof service.description === 'string' ? service.description : ''
  return {
    ...service,
    points: service.points || service.covers || [],
    description: Array.isArray(service.description) ? service.description : [],
    contentHtml: html,
    imageSmall: service.imageSmall || service.image,
  }
}

const normalizeBlog = (post) => ({
  ...post,
  description: post.description || [],
  contentHtml: post.contentHtml || (typeof post.content === 'string' ? post.content : ''),
})

async function load() {
  if (pending) return
  pending = true
  try {
    const response = await fetch('/api/content')
    if (response.ok) {
      const data = await response.json()
      state = {
        loaded: true,
        services: data.services?.length ? data.services.map(normalizeService) : null,
        blogs: data.blogs?.length ? data.blogs.map(normalizeBlog) : null,
        siteDetails: data.siteDetails || null,
        pageSeo: data.pageSeo || [],
        serviceDetail: data.serviceDetail || null,
        blogDetail: data.blogDetail || null,
      }
    }
  } catch {
    /* keep bundled content */
  }
  pending = false
  listeners.forEach((listener) => listener())
}

export function useContent() {
  const [, force] = useState(0)

  useEffect(() => {
    const listener = () => force((value) => value + 1)
    listeners.add(listener)
    load()
    return () => listeners.delete(listener)
  }, [])

  return {
    services: state.services || bundledServices,
    blogs: state.blogs || bundledPosts,
    siteDetails: state.siteDetails || CLINIC_INFO,
    pageSeo: state.pageSeo || [],
    serviceDetail: state.serviceDetail || SERVICE_DETAIL,
    blogDetail: state.blogDetail || BLOG_DETAIL,
    details: {
      serviceDetail: state.serviceDetail || SERVICE_DETAIL,
      blogDetail: state.blogDetail || BLOG_DETAIL,
    },
  }
}

/** Applies admin-managed SEO tags to the document head after navigation. */
export function usePageSeo({ path, title, description, keywords, canonical }) {
  useEffect(() => {
    if (typeof document === 'undefined') return
    const apply = (selector, attrs) => {
      let tag = document.head.querySelector(selector)
      if (!attrs) return
      if (!tag) {
        tag = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
        document.head.appendChild(tag)
      }
      Object.entries(attrs).forEach(([key, value]) => tag.setAttribute(key, value))
    }

    if (title) document.title = title
    apply('meta[name="description"]', description ? { name: 'description', content: description } : null)
    apply('meta[name="keywords"]', keywords ? { name: 'keywords', content: keywords } : null)
    const origin = window.location.origin
    apply('link[rel="canonical"]', { rel: 'canonical', href: canonical || `${origin}${path}` })
  }, [path, title, description, keywords, canonical])
}
