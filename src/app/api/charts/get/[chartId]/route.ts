import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;

  // public/charts 디렉터리의 경로 설정
  const filePath = path.join(process.cwd(), 'public', 'charts', `${chartId}.json`);

  // 파일 존재 여부 확인
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ message: '차트를 찾을 수 없습니다.' }, { status: 404 });
  }

  // JSON 파일 읽기
  const data = fs.readFileSync(filePath, 'utf-8');

  // JSON 파싱 후 응답
  return NextResponse.json(JSON.parse(data));
}
