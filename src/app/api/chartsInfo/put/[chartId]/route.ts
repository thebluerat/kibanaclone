import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const chartsInfoPath = path.join(process.cwd(), 'public/chartsInfo');

export async function PUT(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;

  try {
    const body = await req.json();
    const { title, description } = body;

    // title과 description이 없으면 에러 반환
    if (!title || !description) {
      return NextResponse.json({ message: 'title과 description은 필수입니다.' }, { status: 400 });
    }

    const chartInfoPath = path.join(chartsInfoPath, `${chartId}.json`);

    // 기존 차트 정보 가져오기
    const existingInfo = await readFile(chartInfoPath, 'utf8');
    const parsedInfo = JSON.parse(existingInfo);

    // 차트 정보 업데이트
    const updatedInfo = {
      ...parsedInfo,
      title,
      description,
    };

    // 업데이트된 차트 정보를 파일에 저장
    await writeFile(chartInfoPath, JSON.stringify(updatedInfo, null, 2));

    return NextResponse.json({ message: '차트 정보가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('차트 정보 업데이트 오류:', error);
    return NextResponse.json({ message: '차트 정보 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
