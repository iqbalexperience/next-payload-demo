import withPayload from '../../../../middleware/withPayload'
import httpStatus from 'http-status'
import NotFound from 'payload/dist/errors/NotFound'
import convertPayloadJSONBody from '../../../../middleware/convertPayloadJSONBody'
import authenticate from '../../../../middleware/authenticate'
import initializePassport from '../../../../middleware/initializePassport'
import formatSuccessResponse from 'payload/dist/express/responses/formatSuccess'
import { getTranslation } from 'payload/dist/utilities/getTranslation'
import i18n from '../../../../middleware/i18n'
import fileUpload from '../../../../middleware/fileUpload'
import withDataLoader from '../../../../middleware/dataLoader'
import getErrorHandler from 'payload/dist/express/middleware/errorHandler'
import findVersions from 'payload/dist/globals/operations/findVersions'
import { isNumber } from '../../../../utilities/isNumber'

async function handler(req, res) {
  try {
    const globalConfig = req.payload.globals.config.find(global => global.slug === req.query.global)
    const slug = req.query.global

    if (req.query.collection.endsWith('_versions')) {
      switch (req.method) {
        case 'GET': {
          const result = await findVersions({
            globalConfig: globalConfig,
            where: req.query.where,
            page: isNumber(req.query.page) ? Number(req.query.page) : undefined,
            limit: isNumber(req.query.limit) ? Number(req.query.limit) : undefined,
            sort: req.query.sort,
            depth: isNumber(req.query.depth) ? Number(req.query.depth) : undefined,
            req: req,
            overrideAccess: false,
            showHiddenFields: false,
          })

          return res.status(httpStatus.OK).json(result || { message: req.t('general:notFound'), value: null })
        }

        default: {
          // swallow other methods for versions
          return res.status(httpStatus.NOT_FOUND).json(new NotFound(req.t));
        }
      }
    }

    switch (req.method) {
      case 'GET': {
        const result = await req.payload.findGlobal({
          fallbackLocale: req.query.fallbackLocale,
          user: req.user,
          draft: req.query.draft === 'true',
          showHiddenFields: false,
          overrideAccess: false,
          slug,
          depth: Number(req.query.depth),
          locale: req.query.locale,
        })

        return res.status(200).json(result)
      }

      case 'POST': {
        const global = await req.payload.updateGlobal({
          slug,
          depth: req.query.draft === 'true',
          locale: req.query.locale,
          fallbackLocale: req.query.fallbackLocale,
          data: req.body,
          user: req.user,
          overrideAccess: false,
          showHiddenFields: false,
          draft: req.query.draft === 'true',
        })

        return res.status(201).json({
          ...formatSuccessResponse(req.i18n.t('general:updatedSuccessfully', { label: getTranslation(globalConfig.label, req.i18n) }), 'message'),
          global,
        })
      }
    }
  } catch (error) {
    const errorHandler = getErrorHandler(req.payload.config, req.payload.logger)
    return errorHandler(error, req, res, () => null);
  }

  return res.status(httpStatus.NOT_FOUND).json(new NotFound(req.t))
}

export const config = {
  api: {
    bodyParser: false,
  }
}

export default withPayload(
  withDataLoader(
    fileUpload(
      convertPayloadJSONBody(
        i18n(
          initializePassport(
            authenticate(
              handler
            )
          )
        )
      )
    )
  )
)
