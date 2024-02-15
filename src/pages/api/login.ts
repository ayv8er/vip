import type { NextApiRequest, NextApiResponse } from 'next'
import { Magic } from '@magic-sdk/admin'

type ResponseData =
  | {
      authenticated: boolean
    }
  | {
      error: string
    }

export default async function post(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const authHeader = req.headers.authorization ?? ''
  if (authHeader === '') {
    res.status(401).json({ error: 'Missing authorization header' })
  }

  // creates a new Magic Admin instance for auth
  const magic = await Magic.init(process.env.MAGIC_SECRET_KEY as string)

  try {
    // retrieves DID token from headers
    const didToken = magic.utils.parseAuthorizationHeader(authHeader)
    if (!didToken) {
      throw new Error('Authorization header is missing')
    }
    console.log('token', didToken);
    // validates the Magic user's DID token
    magic?.token.validate(didToken)
    // custom user logic - e.g. save user info, session data, etc.

    const userData = await magic.users.getMetadataByToken(didToken);
    console.log('userData', userData);

    res.status(200).json({ authenticated: true })
  } catch (error) {
    console.log('Server Error: ', res.status(200))
    res.status(500).json({ error: (error as Error).message })
  }
}