import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// public/charts 디렉토리 경로
const chartsDir = path.join(process.cwd(), 'public', 'charts');

// GET 핸들러
export async function GET() {
  try {
    const files = fs.readdirSync(chartsDir); // charts 디렉토리에서 파일 목록 가져오기
    const charts = files.map((file) => ({
      name: file.replace('.json', ''), // 파일 이름에서 .json 확장자를 제거하여 차트 이름 설정
      filePath: `/charts/${file}`, // 차트 파일 경로
    }));
    
    return NextResponse.json({ charts }); // 차트 목록 반환
  } catch (error) {
    console.error('Error loading charts:', error);
    return NextResponse.json({ error: '차트를 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
