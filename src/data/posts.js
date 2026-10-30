export const posts = [
  {
    slug: 'back-pain-habits',
    date: '19',
    month: 'Aug 2026',
    title: '5 Daily Habits That Reduce Back Pain',
    category: 'Back Care',
    excerpt:
      'Small changes to how you sit, lift and move add up. Here are the five habits we teach most often at our Noida clinic.',
    image: '/assets/img/posts/back-pain-habits.jpg',
    description: [
      'Most lower back pain we see is not caused by one dramatic event. It is the result of thousands of small loads: how you sit, how you pick things up, how long you stay in one position and how little you move in between.',
      'The five habits we teach most often are simple. Stand up and move for two minutes every hour. Keep whatever you lift close to your body instead of reaching. Sit with your hips slightly higher than your knees. Stretch your hips, not just your back. And walk — twenty to thirty minutes a day does more for most backs than any single exercise.',
      'If pain lasts more than two weeks, gets worse at night, or travels down your leg, book an assessment. Early, specific treatment is always easier than waiting.'
    ]
  },
  {
    slug: 'sports-injury-recovery',
    date: '13',
    month: 'Aug 2026',
    title: 'Recovering Faster After a Sports Injury',
    category: 'Sports Rehab',
    excerpt:
      'Rest alone is rarely the answer. Early loading, mobility work and a graded return to sport make the real difference.',
    image: '/assets/img/posts/sports-injury-recovery.jpg',
    description: [
      'Complete rest after a sports injury feels safe, but tissue that is not loaded loses strength and stiffness quickly. Modern rehabilitation loads the injury early — within a comfortable range — and progresses on measurable milestones rather than on how the joint feels on a good day.',
      'A typical plan moves through four phases: controlling pain and swelling, restoring full movement, rebuilding strength and control, then sport-specific testing before clearance. Each phase has criteria to pass before you move on.',
      'Return-to-sport decisions made on criteria, not on the calendar, are what keep athletes from re-injuring the same structure. That applies equally to national-level para-athletes and weekend players.'
    ]
  },
  {
    slug: 'desk-job-neck-pain',
    date: '26',
    month: 'Aug 2026',
    title: 'How to Stay Pain-Free at a Desk Job',
    category: 'Posture',
    excerpt:
      'Neck and shoulder pain from long screen hours is common — and very treatable with the right setup and exercises.',
    image: '/assets/img/posts/desk-job-neck-pain.jpg',
    description: [
      'Screen work puts the neck in a forward position for hours at a time. The muscles at the front of the chest tighten, the muscles at the back of the neck work overtime, and by the end of the day the headache or shoulder ache is predictable.',
      'The fix has two parts. First, the setup: screen at eye level, feet flat, elbows near ninety degrees, and the keyboard close enough that your shoulders stay relaxed. Second, the routine: a micro-break every hour where you look up, roll your shoulders and stretch your chest for thirty seconds.',
      'Setup changes stop the aggravation; targeted exercise treats what is already irritated. You need both, and neither has to take more than a few minutes.'
    ]
  },
  {
    slug: 'knee-replacement-rehab',
    date: '02',
    month: 'Sep 2026',
    title: 'Your First Six Weeks After Knee Replacement',
    category: 'Post-Surgery',
    excerpt:
      'What progressive rehabilitation should look like week by week, and the milestones to watch for at home.',
    image: '/assets/img/posts/knee-replacement-rehab.jpg',
    description: [
      'The first six weeks decide how good the knee feels at six months. The priorities early on are controlling swelling, restoring full straightening, bending progressively and walking safely with the aid your surgeon has approved.',
      'Week by week, the focus shifts: the first two weeks are about movement and swelling control, weeks three to four build bend and walking distance, and by weeks five to six the emphasis moves to strength — quad sets, straight-leg raises, step work and stationary cycling.',
      'Stiffness that does not improve, increasing redness, fever, or sudden sharp pain are reasons to call your surgeon. Everything else is usually a pacing problem, and a physiotherapist can adjust the plan.'
    ]
  },
  {
    slug: 'home-physiotherapy-guide',
    date: '09',
    month: 'Sep 2026',
    title: 'Home Physiotherapy: What to Expect',
    category: 'Home Visits',
    excerpt:
      'No travel, no waiting room. Here is how a home session works, what equipment your therapist brings and who it suits.',
    image: '/assets/img/posts/home-physiotherapy-guide.jpg',
    description: [
      'A home session works much like a clinic session, except the clinic comes to you. The therapist brings the portable equipment — bands, mobilisation tools, TENS or IFT where needed — and uses your own chair, bed and stairs to assess how you move in the environment you actually live in.',
      'Home visits suit post-surgical patients, elderly patients with mobility difficulty, neurological cases that need transfer practice at home, and anyone with a schedule that makes clinic visits hard. Across Noida, we run them seven days a week.',
      'The first visit includes the same assessment you would get at the clinic: history, range of motion, strength testing and a written plan. Treatment starts in the same session.'
    ]
  },
  {
    slug: 'dry-needling-explained',
    date: '17',
    month: 'Sep 2026',
    title: 'Dry Needling and Cupping, Explained',
    category: 'Advanced Therapy',
    excerpt:
      'Two techniques patients ask about most. When they help, when they do not, and how they fit into a treatment plan.',
    image: '/assets/img/posts/dry-needling-explained.jpg',
    description: [
      'Dry needling uses a thin filament needle to release trigger points — tight, irritable bands in muscle that refer pain to other areas. Cupping uses suction to lift tissue and improve mobility in restricted fascia. Both are tools, not treatments on their own.',
      'They work best when they are part of an assessment-led plan: release the restricted tissue, then load it through movement so the change holds. Used alone, the relief is often temporary.',
      'Neither is right for everyone. We avoid needling over infected or injured skin, and cupping marks are cosmetic and fade within a week or two. Your therapist will explain what applies to your case before starting.'
    ]
  }
]

export function findPost(slug) {
  return posts.find((post) => post.slug === slug)
}
