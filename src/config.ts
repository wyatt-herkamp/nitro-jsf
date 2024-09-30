export interface ParsingConfig {
  denyOnUnknownSchema?: boolean
  denyUnknownPropertyTypes?: boolean
  fetchSchema?: (url: string) => Promise<FetchSchemaResponse>
}

export type FetchSchemaResponse =
  | string
  | {
      error?: string
      errorCode?: number
    }

export async function standardSchemaFetch(url: string): Promise<FetchSchemaResponse> {
  const response = await fetch(url)
  if (response.ok) {
    return response.text()
  }
  return { error: response.statusText, errorCode: response.status }
}

export const DEFAULT_PARSING_CONFIG: ParsingConfig = {
  denyOnUnknownSchema: false,
  denyUnknownPropertyTypes: false,
  fetchSchema: standardSchemaFetch
}

export class InternalConfig {
  parsingConfig?: ParsingConfig
  constructor(config?: ParsingConfig) {
    this.parsingConfig = config
  }

  denyOnUnknownSchema(): boolean {
    return this.parsingConfig?.denyOnUnknownSchema ?? false
  }
  denyOnUnknownPropertyTypes(): boolean {
    return this.parsingConfig?.denyUnknownPropertyTypes ?? false
  }

  fetchSchema(url: string): Promise<FetchSchemaResponse> | undefined {
    if (this.parsingConfig?.fetchSchema) {
      return this.parsingConfig?.fetchSchema(url)
    } else {
      return undefined
    }
  }
}
