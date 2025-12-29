import cron from 'node-cron'
import Post from '../models/Post.js'

let job = null

async function processDuePosts() {
  try {
    const now = new Date()
    const due = await Post.findDuePosts(now)
    if (!due || due.length === 0) return

    for (const post of due) {
      try {
        await post.markQueued()
        console.log(`Queued post ${post._id} for publishing`)
      } catch (err) {
        console.error(`Failed to queue post ${post._id}:`, err)
      }
    }
  } catch (err) {
    console.error('Scheduler processDuePosts error:', err)
  }
}

export function startScheduler() {
  if (job) return job

  // run every minute
  job = cron.schedule('* * * * *', async () => {
    await processDuePosts()
  })

  // run immediately at startup
  processDuePosts().catch(err => console.error('Scheduler startup error:', err))

  console.log('✅ Scheduler started (running every minute)')
  return job
}

export function stopScheduler() {
  if (job) job.stop()
}
