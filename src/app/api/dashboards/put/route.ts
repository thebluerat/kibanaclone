// src/app/api/dashboards/put.ts
import { NextResponse } from 'next/server';
import { dashboards } from '../dashboardsData'; // 데이터 모듈에서 가져오기
import { saveDashboards } from '../dashboardService';

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const dashboardIndex = dashboards.findIndex(d => d.id === id);
  if (dashboardIndex >= 0) {
    dashboards[dashboardIndex].name = name;
    saveDashboards(dashboards); // 변경된 대시보드 저장
    return NextResponse.json(dashboards[dashboardIndex]);
  }
  return NextResponse.json({ error: '대시보드를 찾을 수 없습니다.' }, { status: 404 });
}
