import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const chartsInfoPath = path.join(process.cwd(), 'public/chartsInfo');

export async function GET(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;
  const decodedId = decodeURIComponent(chartId);

  try {
    const infoData = await readFile(path.join(chartsInfoPath, `${decodedId}.json`), 'utf-8');
    return NextResponse.json(JSON.parse(infoData));
  } catch (error) {
    console.error('차트 정보 읽기 오류:', error);
    return NextResponse.json({ message: '차트 정보를 찾을 수 없습니다.' }, { status: 404 });
  }
}
