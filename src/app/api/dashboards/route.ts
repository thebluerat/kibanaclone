import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Dashboard } from '../../../types/dashboard';

const dashboardsDir = path.join(process.cwd(), 'data', 'dashboards');

export async function GET(req: Request) {
  try {
    if (!fs.existsSync(dashboardsDir)) {
      return NextResponse.json([]); // 대시보드가 없을 경우 빈 배열 반환
    }

    const files = fs.readdirSync(dashboardsDir);
    const dashboards: Dashboard[] = files.map((file) => {
      const filePath = path.join(dashboardsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(fileContent);
    });

    return NextResponse.json(dashboards);
  } catch (error) {
    console.error('대시보드 목록을 가져오는 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드 목록을 가져오는 중 오류 발생' }, { status: 500 });
  }
}