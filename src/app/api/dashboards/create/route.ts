// src/app/api/dashboards/post.ts
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid'; // UUID 가져오기
import { Dashboard } from '../../../../types/dashboard';
import fs from 'fs';
import path from 'path';

const dashboardsDir = path.join(process.cwd(), 'data', 'dashboards');

// Ensure the dashboards directory exists
if (!fs.existsSync(dashboardsDir)) {
  fs.mkdirSync(dashboardsDir, { recursive: true });
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const newDashboard: Dashboard = { id: uuidv4(), name, charts: [] }; // UUID를 사용하여 고유 ID 생성

  // 대시보드를 파일로 저장
  const filePath = path.join(dashboardsDir, `${newDashboard.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(newDashboard, null, 2));

  return NextResponse.json(newDashboard);
}