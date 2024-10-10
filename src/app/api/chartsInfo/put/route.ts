import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

const chartsInfoPath = path.join(process.cwd(), 'public/chartsInfo');

export async function PUT(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;
  
  try {
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ message: 'title과 description은 필수입니다.' }, { status: 400 });
    }

    await writeFile(path.join(chartsInfoPath, `${chartId}.json`), JSON.stringify(body, null, 2));
    return NextResponse.json({ message: '차트 정보가 업데이트되었습니다.' });
  } catch (error) {
    console.error('차트 정보 업데이트 오류:', error);
    return NextResponse.json({ message: '차트 정보 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
