import { NextResponse } from 'next/server';
import { timestamp } from '../../../utilities/timestamp'
import getPayloadClient from '../../../payload/payloadClient'

timestamp('outside function')

export async function GET() {
  timestamp('before init')
  const payload = await getPayloadClient()
  timestamp('after init')
  return NextResponse.json({ hello: 'test' })
}

export const dynamic = 'force-dynamic'
export const revalidate = 0