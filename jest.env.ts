// Early test environment polyfills loaded before modules
// Provide TextEncoder/TextDecoder for node modules (undici, busboy) that expect Web API globals
declare const global: any

if (
  typeof global.TextEncoder === 'undefined' ||
  typeof global.TextDecoder === 'undefined'
) {
  try {
    // Use util if available
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { TextEncoder, TextDecoder } = require('util')
    global.TextEncoder = TextEncoder
    global.TextDecoder = TextDecoder
  } catch (e) {
    global.TextEncoder = class TextEncoder {
      encode(input: string) {
        return Buffer.from(input, 'utf-8')
      }
    }
    global.TextDecoder = class TextDecoder {
      decode(input: Uint8Array | Buffer) {
        return Buffer.from(input as any).toString('utf-8')
      }
    }
  }
}

// Minimal Request/Response if not present (some modules import undici)
if (typeof global.Request === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Request, Response } = require('undici')
    global.Request = Request
    global.Response = Response
  } catch (e) {
    global.Request = class Request {
      url: string
      method: string
      headers: any
      constructor(url: string, init?: any) {
        this.url = url
        this.method = init?.method || 'GET'
        this.headers = init?.headers || {}
      }
    }
    global.Response = class Response {
      status: number
      body: any
      constructor(body?: any, init?: any) {
        this.body = body
        this.status = init?.status || 200
      }
      async json() {
        try {
          return JSON.parse(this.body)
        } catch {
          return this.body
        }
      }
    }
  }
}

export {}
