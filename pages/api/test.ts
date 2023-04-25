import { Response } from 'express'
import httpStatus from 'http-status'
import { PayloadRequest } from 'payload/dist/types'
import authenticate from '@payloadcms/next-payload/dist/middleware/authenticate'
import initializePassport from '@payloadcms/next-payload/dist/middleware/initializePassport'
import withDataLoader from '@payloadcms/next-payload/dist/middleware/dataLoader'
import getPayloadClient from '../../payload/payloadClient'
import { timestamp } from '../../utilities/timestamp'

timestamp('outside function')

async function handler(req: PayloadRequest, res: Response) {
  timestamp('before query')
  const pages = await req.payload.find({
    collection: 'pages',
  })
  timestamp('after query')
  return res.status(httpStatus.OK).json(pages)
}

const withPayload = (handler: any) => async (req: any, res: any) => {
  timestamp('before initializing payload')
  req.payload = await getPayloadClient();
  timestamp('after initializing payload')
  return handler(req, res);
};

export default withPayload(
  withDataLoader(
    initializePassport(
      authenticate(
        handler
      )
    )
  )
)

export const config = {
  api: {
    externalResolver: true
  }
}