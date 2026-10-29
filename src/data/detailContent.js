// Default copy for the detail pages. Each service/post can override any field
// via `service.detail` / `post.content`, so the admin only edits data.
export const SERVICE_DETAIL = {
  mediaBadge: 'Evidence-Based Rehabilitation',
  pills: ['45–60 Mins Session', '1-on-1 Personalized', 'Clinic & Home Visits'],
  faqs: [
    {
      q: 'Do I need a doctor’s prescription or referral to start physiotherapy?',
      a: 'No referral is needed. You can book an assessment directly with Dr. Arun Yadav. If you already have MRI reports, X-rays, or surgical discharge summaries, please bring them along to your first appointment.'
    },
    {
      q: 'How many sessions will I need to see significant improvement?',
      a: 'Most patients experience meaningful pain reduction and mobility gains within 3 to 5 sessions. During your comprehensive 45-minute assessment, Dr. Arun will provide an honest, milestone-based recovery roadmap.'
    },
    {
      q: 'Are home visit physiotherapy sessions available for this condition?',
      a: 'Yes. We provide certified home physiotherapy visits across Noida and Greater Noida West for post-operative, neurological, and elderly patients who cannot travel to the clinic.'
    }
  ]
}

export const BLOG_DETAIL = {
  subtitle: 'Clinical Insights & Recovery Guides · Dr. Arun Yadav, Wellness Physiotherapy',
  readTime: '4 min read',
  caption: 'Clinical Recovery Guide · Wellness Physiotherapy Centre, Noida',
  sectionHeadings: [
    'What Causes the Problem & How to Reverse It',
    'When You Should Seek Professional Physiotherapy'
  ],
  quote: {
    text: 'Tissue that is unloaded loses strength and resilience rapidly. Early guided movement and controlled progressive loading always deliver superior, lasting recovery over passive rest.',
    cite: 'Dr. Arun Yadav, Founder & Chief Physiotherapist'
  },
  closing:
    'At Wellness Physiotherapy Centre in Noida Sector 04, our goal is to pinpoint the exact biomechanical dysfunction driving your symptoms and provide one-on-one guided rehabilitation so you can return to life, sports, and active work without fear of re-injury.'
}
