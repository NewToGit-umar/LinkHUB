import express from 'express'

const router = express.Router()

// Simple mock dashboard endpoint - replace with real aggregation later
router.get('/', async (req, res) => {
  try {
    const mockData = {
      stats: {
        totalPosts: 45,
        scheduledPosts: 12,
        connectedAccounts: 3,
        totalEngagement: 1247
      },
      analytics: [
        { date: '2024-01', engagement: 400 },
        { date: '2024-02', engagement: 600 },
        { date: '2024-03', engagement: 800 },
        { date: '2024-04', engagement: 1200 },
      ],
      recentPosts: [
        { id: 1, content: 'Just launched our new feature!', status: 'published', engagement: 245 },
        { id: 2, content: 'Weekly tips for social media growth', status: 'scheduled', engagement: 0 },
      ]
    }
    res.status(200).json(mockData)
  } catch (err) {
    res.status(500).json({ message: 'Dashboard error', error: err.message })
  }
})

export default router
