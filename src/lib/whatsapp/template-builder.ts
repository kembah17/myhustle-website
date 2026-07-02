/**
 * Build Meta template message payloads for MyHustle.
 * Simplified from M4E — handles body params and simple headers.
 */

export interface TemplateSendParams {
  /** Values for body {{1}}, {{2}}, etc. */
  body?: string[]
  /** Value for text header {{1}} if applicable. */
  headerText?: string
  /** Media URL for image/video/document headers. */
  headerMediaUrl?: string
}

export type MetaSendComponent =
  | { type: 'header'; parameters: Array<Record<string, unknown>> }
  | { type: 'body'; parameters: Array<{ type: 'text'; text: string }> }

/**
 * Build the components array for a template send.
 * Returns empty array for static templates (no variables).
 */
export function buildTemplateComponents(
  params: TemplateSendParams = {},
): MetaSendComponent[] {
  const out: MetaSendComponent[] = []

  // Header component
  if (params.headerText) {
    out.push({
      type: 'header',
      parameters: [{ type: 'text', text: params.headerText }],
    })
  } else if (params.headerMediaUrl) {
    out.push({
      type: 'header',
      parameters: [{ type: 'image', image: { link: params.headerMediaUrl } }],
    })
  }

  // Body component
  if (params.body && params.body.length > 0) {
    out.push({
      type: 'body',
      parameters: params.body.map((text) => ({ type: 'text', text: String(text) })),
    })
  }

  return out
}

/**
 * Build a complete template message payload for the Meta API.
 */
export function buildTemplatePayload(args: {
  templateName: string
  language?: string
  params?: TemplateSendParams
}): Record<string, unknown> {
  const { templateName, language = 'en_US', params } = args
  const payload: Record<string, unknown> = {
    name: templateName,
    language: { code: language },
  }

  if (params) {
    const components = buildTemplateComponents(params)
    if (components.length > 0) {
      payload.components = components
    }
  }

  return payload
}
