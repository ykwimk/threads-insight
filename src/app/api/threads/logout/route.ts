import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const response = NextResponse.json(
      {
        message: 'Successfully logged out',
      },
      { status: 200 },
    );

    response.cookies.set({
      name: process.env.SERVICE_ACCESS_TOKEN!,
      value: '',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: -1,
    });

    response.cookies.set({
      name: process.env.SERVICE_USER_ID!,
      value: '',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: -1,
    });

    return response;
  } catch (err) {
    console.error('로그아웃 오류', err);
  }
}
