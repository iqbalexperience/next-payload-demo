import { NextResponse } from 'next/server';
import { timestamp } from '../../../utilities/timestamp'
import getPayloadClient from '../../../payload/payloadClient'

timestamp('outside function')

export async function GET() {
  const payload = await getPayloadClient()

  timestamp('before query')

  const pages = await payload.find({
    collection: 'pages',
  })

  timestamp('after query')
  return NextResponse.json(pages)
}
