import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.THREADS_CLIENT_ID;
  const redirectUri =
    process.env.NODE_ENV === 'development'
      ? process.env.THREADS_LOCAL_REDIRECT_URI
      : process.env.THREADS_REDIRECT_URI;
  const scope = [
    'threads_basic',
    'threads_content_publish',
    'threads_keyword_search',
    'threads_manage_insights',
    'threads_manage_mentions',
    'threads_manage_replies',
    'threads_read_replies',
  ].join(',');

  const threadsAuthUrl = `https://threads.net/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri!,
  )}&scope=${scope}&response_type=code`;

  return NextResponse.redirect(threadsAuthUrl);
}
