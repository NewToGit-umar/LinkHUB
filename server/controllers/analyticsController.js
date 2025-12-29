import Analytics from '../models/Analytics.js'
import SocialAccount from '../models/SocialAccount.js'
import Post from '../models/Post.js'

// Placeholder: fetch analytics from provider APIs for an account.
// Real implementation would call provider endpoints with account tokens.
async function fetchProviderAnalyticsPlaceholder(account) {
  // Return empty metrics for recent posts — placeholder only
  return []
}

export async function fetchAndIngest(req, res) {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const accounts = await SocialAccount.find({ userId })
    let ingested = 0

    for (const acc of accounts) {
      // placeholder fetch
      const providerData = await fetchProviderAnalyticsPlaceholder(acc)

      // If providerData empty, create placeholder analytics for recent posts
      if (!providerData || providerData.length === 0) {
        const recentPosts = await Post.find({ userId, platforms: acc.platform }).sort({ publishedAt: -1 }).limit(10)
        for (const p of recentPosts) {
          await Analytics.create({
            postId: p._id,
            userId,
            platform: acc.platform,
            metrics: { likes: 0, shares: 0, comments: 0, impressions: 0, reach: 0 },
            recordedAt: new Date()
          })
          ingested++
        }
      } else {
        for (const item of providerData) {
          await Analytics.create({
            postId: item.postId || null,
            userId,
            platform: acc.platform,
            metrics: item.metrics || { likes: 0, shares: 0, comments: 0, impressions: 0, reach: 0 },
            recordedAt: item.recordedAt ? new Date(item.recordedAt) : new Date()
          })
          ingested++
        }
      }
    }

    return res.status(200).json({ message: 'Analytics ingested (placeholder)', ingested })
  } catch (err) {
    console.error('fetchAndIngest error', err)
    return res.status(500).json({ message: 'Error fetching analytics', error: err.message })
  }
}

export async function summary(req, res) {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const { from, to, months } = req.query

    const byPlatform = await Analytics.aggregateByPlatform(userId, from, to)
    const monthly = await Analytics.monthlyCounts(userId, months ? parseInt(months, 10) : 6)

    return res.status(200).json({ byPlatform, monthly })
  } catch (err) {
    console.error('analytics summary error', err)
    return res.status(500).json({ message: 'Error fetching analytics summary', error: err.message })
  }
}
