import { NextResponse } from 'next/server';
import { dashboards } from '../dashboardsData'; // 데이터 모듈에서 가져오기

export async function GET(req: Request) {
  return NextResponse.json(dashboards);
}
