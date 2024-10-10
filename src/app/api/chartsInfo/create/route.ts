import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const chartsInfoPath = path.join(process.cwd(), 'public/chartsInfo');

export async function POST(req: Request) {
  const { title, description, chartId } = await req.json();
  const chartInfo = { title, description, chartId };

  try {
    // chartsInfo 디렉터리 존재 여부 확인 후 생성
    await mkdir(chartsInfoPath, { recursive: true });

    // 차트 정보를 JSON 파일로 저장
    await writeFile(path.join(chartsInfoPath, `${chartId}.json`), JSON.stringify(chartInfo, null, 2));
    return NextResponse.json({ message: '차트 정보가 저장되었습니다.' });
  } catch (error) {
    console.error('차트 정보 저장 오류:', error);
    return NextResponse.json({ message: '차트 정보를 저장할 수 없습니다.' }, { status: 500 });
  }
}
