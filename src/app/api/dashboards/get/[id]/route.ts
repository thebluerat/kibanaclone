import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const dashboardsPath = path.join(process.cwd(), 'data', 'dashboards.json'); // 대시보드 전체 데이터 파일 경로

  try {
    if (!fs.existsSync(dashboardsPath)) {
      return NextResponse.json({ message: '대시보드를 찾을 수 없습니다.' }, { status: 404 });
    }

    const fileContents = fs.readFileSync(dashboardsPath, 'utf-8');
    const dashboards = JSON.parse(fileContents);

    // 대시보드 ID에 해당하는 항목만 반환
    const dashboard = dashboards.find((d: { id: string; }) => d.id === id);
    
    if (!dashboard) {
      return NextResponse.json({ message: '해당 ID의 대시보드를 찾을 수 없습니다.' }, { status: 404 });
    }

    return NextResponse.json(dashboard);
  } catch (error) {
    console.error('대시보드 데이터를 가져오는 중 오류 발생:', error);
    return NextResponse.json({ message: '대시보드 데이터를 가져오는 중 오류 발생', error }, { status: 500 });
  }
}
