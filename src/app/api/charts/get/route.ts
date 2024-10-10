import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// public/charts 디렉토리 경로
const chartsDir = path.join(process.cwd(), 'public', 'charts');

// GET 핸들러
export async function GET() {
  try {
    // charts 디렉토리에서 파일 목록 가져오기
    const files = fs.readdirSync(chartsDir);

    // 파일이 없다면 빈 배열 반환
    if (!files || files.length === 0) {
      return NextResponse.json({ charts: [] });
    }

    // 차트 목록 생성
    const charts = files.map((file) => {
      const filePath = path.join(chartsDir, file);
      const stats = fs.statSync(filePath); // 파일의 메타데이터를 가져옴

      return {
        id: file.replace('.json', ''), // .json 확장자를 제거하여 차트 ID 설정
        title: file.replace('.json', ''), // 차트 제목
        filePath: `/charts/${file}`, // 차트 파일 경로
        createdAt: stats.birthtime.toISOString(), // 생성 날짜를 ISO 형식으로 변환
      };
    });

    console.log('Loaded charts:', charts); // 차트 목록을 콘솔에 출력

    return NextResponse.json({ charts }); // 차트 목록 반환
  } catch (error) {
    console.error('Error loading charts:', error);
    return NextResponse.json({ error: '차트를 불러오는 데 실패했습니다.' }, { status: 500 });
  }
}
