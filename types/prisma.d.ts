import { Geo as _Geo } from '@vercel/functions'
import { userAgent } from 'next/server'

declare global {
  namespace PrismaJson {
    type ClassVariables = {
      [key: string]: any
    }
    type Geo = _Geo
    type Agent = ReturnType<typeof userAgent>
  }
}
