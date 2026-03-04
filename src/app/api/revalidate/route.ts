import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'

export async function POST(request: NextRequest) {
  let body: { secret?: string; paths?: string[]; tags?: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Optional secret check - if REVALIDATION_SECRET is set, enforce it
  const secret = process.env.REVALIDATION_SECRET
  if (secret && body.secret !== secret) {
    const origin = request.headers.get('origin') || ''
    const host = request.headers.get('host') || ''
    if (!origin.includes(host) && !request.headers.get('referer')?.includes(host)) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }
  }

  const revalidated: { paths: string[]; tags: string[] } = { paths: [], tags: [] }

  // Revalidate specific paths
  if (body.paths && Array.isArray(body.paths)) {
    for (const path of body.paths) {
      try {
        revalidatePath(path)
        revalidated.paths.push(path)
      } catch (e) {
        console.error(`Failed to revalidate path ${path}:`, e)
      }
    }
  }

  // Revalidate by tags (Next.js 16 requires profile as second arg)
  if (body.tags && Array.isArray(body.tags)) {
    for (const tag of body.tags) {
      try {
        revalidateTag(tag, 'default')
        revalidated.tags.push(tag)
      } catch (e) {
        console.error(`Failed to revalidate tag ${tag}:`, e)
      }
    }
  }

  // If no specific paths or tags, revalidate common pages
  if ((!body.paths || body.paths.length === 0) && (!body.tags || body.tags.length === 0)) {
    const defaultPaths = ['/', '/categories', '/near-me']
    for (const path of defaultPaths) {
      try {
        revalidatePath(path)
        revalidated.paths.push(path)
      } catch (e) {
        console.error(`Failed to revalidate path ${path}:`, e)
      }
    }
  }

  return NextResponse.json({
    message: `Revalidated ${revalidated.paths.length} paths and ${revalidated.tags.length} tags`,
    revalidated,
  })
}
