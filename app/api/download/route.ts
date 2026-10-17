import { NextRequest, NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const file = searchParams.get('file') || 'Harmonia-mobile.apk'

  // Prevent directory traversal
  const safeFilename = path.basename(file)

  let filePath = path.join(process.cwd(), 'public', safeFilename)
  if (!fs.existsSync(filePath)) {
    filePath = path.join(process.cwd(), 'public', 'releases', safeFilename)
  }

  if (!fs.existsSync(filePath)) {
    // Default to the main latest build if requested file doesn't exist
    filePath = path.join(process.cwd(), 'public', 'Harmonia-mobile.apk')
  }

  const GITHUB_DOWNLOAD_URL =
    'https://github.com/shreeharsh-patil/Harmonia/releases/download/v2.0.0/Harmonia-mobile.apk'

  if (!fs.existsSync(filePath)) {
    return NextResponse.redirect(GITHUB_DOWNLOAD_URL, 302)
  }

  const stat = fs.statSync(filePath)
  const fileStream = fs.createReadStream(filePath)

  return new NextResponse(fileStream as any, {
    headers: {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': `attachment; filename="${safeFilename}"`,
      'Content-Length': stat.size.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
