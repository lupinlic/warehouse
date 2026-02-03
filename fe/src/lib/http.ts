const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

type HttpError = { status: number; message: string; data?: any }

async function parseJsonSafe(res: Response) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getAccessTokenFromCookie() {
  if (typeof document === 'undefined') return null
  try {
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === 'accessToken' && value) {
        return decodeURIComponent(value)
      }
    }
    return null
  } catch (e) {
    console.error('Error reading access token cookie:', e)
    return null
  }
}

export async function http<T>(
  path: string,
  options: RequestInit & { json?: any } = {}
): Promise<T> {
  const { json, headers: customHeaders, ...rest } = options

  const token = getAccessTokenFromCookie()
  const finalHeaders: HeadersInit = {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(customHeaders || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: finalHeaders,
    body: json ? JSON.stringify(json) : rest.body,
  })

  const data = await parseJsonSafe(res)

  if (!res.ok) {
    const err: HttpError = {
      status: res.status,
      message: (data as any)?.message || 'Request failed',
      data,
    }
    throw err
  }

  return data as T
}
