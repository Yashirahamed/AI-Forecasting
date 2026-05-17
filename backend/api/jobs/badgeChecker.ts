import { Request, Response } from 'express'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { sendSuccess, sendError } from '../../utils/apiResponse'

const BADGE_RULES: Array<{
  type: string
  name: string
  check: (user: Record<string, unknown>) => boolean
}> = [
  {
    type: 'eco_hero',
    name: 'Eco Hero',
    check: (u) => (u.eco_score as number) >= 100,
  },
  {
    type: 'weather_watcher',
    name: 'Weather Watcher',
    check: (u) => (u.eco_score as number) >= 10,
  },
]

// ─── GET /api/jobs/badgeChecker (Vercel Cron: 0 * * * *)
export default async function handler(_req: Request, res: Response): Promise<void> {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select('firebase_uid, eco_score')

    if (error || !users) {
      sendError(res, error?.message ?? 'Failed to fetch users', 500)
      return
    }

    const badgesAwarded: string[] = []

    for (const user of users) {
      for (const rule of BADGE_RULES) {
        if (!rule.check(user as Record<string, unknown>)) continue

        // Check if badge already earned
        const { data: existing } = await supabaseAdmin
          .from('badges')
          .select('id')
          .eq('user_id', user.firebase_uid as string)
          .eq('badge_type', rule.type)
          .single()

        if (existing) continue

        await supabaseAdmin.from('badges').insert({
          user_id: user.firebase_uid,
          badge_type: rule.type,
          badge_name: rule.name,
          badge_icon: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/badges/${rule.type}.png`,
        })
        badgesAwarded.push(`${String(user.firebase_uid)}:${rule.type}`)
      }
    }

    sendSuccess(res, { badgesAwarded, usersChecked: users.length })
  } catch (err) {
    sendError(res, err instanceof Error ? err.message : 'Badge checker failed', 500)
  }
}
