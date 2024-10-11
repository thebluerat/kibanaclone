// src/app/api/dashboards/[id]/addChart/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Dashboard } from '../../../../../types/dashboard';

const dashboardsDir = path.join(process.cwd(), 'data', 'dashboards');

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const chartData = await req.json();

  const filePath = path.join(dashboardsDir, `${id}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Dashboard not found' }, { status: 404 });
  }

  // 대시보드 파일 읽기
  const dashboard: Dashboard = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 차트 데이터를 대시보드에 추가
  dashboard.charts.push(chartData);

  // 업데이트된 대시보드 저장
  fs.writeFileSync(filePath, JSON.stringify(dashboard, null, 2));

  return NextResponse.json(dashboard);
}