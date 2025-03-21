import { NextRequest, NextResponse } from 'next/server';

// 리다이렉트 함수
function redirectUrl(url: string, baseUrl: URL) {
  return NextResponse.redirect(new URL(url, baseUrl));
}

export async function GET(request: NextRequest) {
  const originalUrl = new URL(request.url);

  const { searchParams } = originalUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return redirectUrl('/?error=' + error, originalUrl);
  }

  if (!code) {
    return redirectUrl('/?error=missing_code', originalUrl);
  }

  try {
    const clientId = process.env.THREADS_CLIENT_ID;
    const clientSecret = process.env.THREADS_CLIENT_SECRET;
    const redirectUri =
      process.env.NODE_ENV === 'development'
        ? process.env.THREADS_LOCAL_REDIRECT_URI
        : process.env.THREADS_REDIRECT_URI;

    const tokenUrl = 'https://graph.threads.net/oauth/access_token';
    const params = new URLSearchParams();
    params.append('client_id', clientId!);
    params.append('client_secret', clientSecret!);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', redirectUri!);
    params.append('code', code);

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('토큰 교환 오류:', errorData);
      return redirectUrl('/?error=token_exchange_failed', originalUrl);
    }

    const { access_token, user_id } = await tokenResponse.json();

    const response = redirectUrl('/dashboard', originalUrl);

    response.cookies.set({
      name: process.env.SERVICE_ACCESS_TOKEN!,
      value: access_token,
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set({
      name: process.env.SERVICE_USER_ID!,
      value: user_id,
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error('콜백 처리 오류:', err);
    return redirectUrl('/?error=callback_exception', originalUrl);
  }
}
