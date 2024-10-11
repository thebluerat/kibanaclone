// src/app/api/dashboards/delete.ts
import { NextResponse } from 'next/server';
import { dashboards } from '../dashboardsData'; // 데이터 모듈에서 가져오기
import { saveDashboards } from '../dashboardService';

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const initialLength = dashboards.length; // 삭제 전 대시보드 수
  const updatedDashboards = dashboards.filter(d => d.id !== id);
  if (dashboards.length < initialLength) {
    saveDashboards(updatedDashboards); // 변경된 대시보드 저장
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ error: '대시보드를 찾을 수 없습니다.' }, { status: 404 });
}
