import Analytics from '../models/Analytics.js'
import SocialAccount from '../models/SocialAccount.js'
import Post from '../models/Post.js'
import analyticsService from '../services/analyticsService.js'

export async function fetchAndIngest(req, res) {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })
    const ingested = await analyticsService.ingestForUser(userId)
    return res.status(200).json({ message: 'Analytics ingested (user)', ingested })
  } catch (err) {
    console.error('fetchAndIngest error', err)
    return res.status(500).json({ message: 'Error fetching analytics', error: err.message })
  }
}

export async function aggregateMetrics(req, res) {
  try {
    const userId = req.user && req.user.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const { from, to, limit } = req.query
    // Use model aggregation helpers to leverage indexes and reuse logic
    const totals = await Analytics.aggregateByPlatform(userId, from, to)
    const topPosts = await Analytics.topPosts(userId, from, to, limit ? parseInt(limit, 10) : 5)

    return res.status(200).json({ totals, topPosts })
  } catch (err) {
    console.error('aggregateMetrics error', err)
    return res.status(500).json({ message: 'Error aggregating metrics', error: err.message })
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
