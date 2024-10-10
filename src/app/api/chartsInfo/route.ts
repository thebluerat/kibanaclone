import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

const chartsInfoPath = path.join(process.cwd(), 'public/chartsInfo'); // 차트 정보가 저장될 경로

export async function GET(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;

  try {
    const infoData = await readFile(path.join(chartsInfoPath, `${chartId}.json`), 'utf-8');
    return NextResponse.json(JSON.parse(infoData));
  } catch (error) {
    console.error('차트 정보 읽기 오류:', error); // 오류 로그 추가
    return NextResponse.json({ message: '차트 정보를 찾을 수 없습니다.' }, { status: 404 });
  }
}

export async function PUT(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;
  
  try {
    const body = await req.json();

    // 차트 정보의 유효성을 검사하는 로직 추가
    if (!body.title || !body.description) {
      return NextResponse.json({ message: 'title과 description은 필수입니다.' }, { status: 400 });
    }

    await writeFile(path.join(chartsInfoPath, `${chartId}.json`), JSON.stringify(body, null, 2));
    return NextResponse.json({ message: '차트 정보가 업데이트되었습니다.' });
  } catch (error) {
    console.error('차트 정보 업데이트 오류:', error); // 오류 로그 추가
    return NextResponse.json({ message: '차트 정보 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
