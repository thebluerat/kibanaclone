import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

// 차트 파일이 저장된 경로
const chartsPath = path.join(process.cwd(), 'public/charts');

export async function PUT(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;

  try {
    const body = await req.json();

    // title과 description은 필수 값이므로 없으면 에러 반환
    if (!body.title || !body.description) {
      return NextResponse.json({ message: 'title과 description은 필수입니다.' }, { status: 400 });
    }

    // 해당 차트 파일 경로
    const chartFilePath = path.join(chartsPath, `${chartId}.json`);

    // 기존 차트 데이터 가져오기
    const existingChart = await readFile(chartFilePath, 'utf8');
    const parsedChart = JSON.parse(existingChart);

    // 기존 차트 데이터에 새로운 데이터를 병합
    const updatedChart = {
      ...parsedChart,
      title: body.title,
      description: body.description,
      ...body // 다른 값이 있으면 추가 업데이트
    };

    // 수정된 차트 데이터 파일에 다시 저장
    await writeFile(chartFilePath, JSON.stringify(updatedChart, null, 2));

    return NextResponse.json({ message: '차트가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('차트 업데이트 오류:', error);
    return NextResponse.json({ message: '차트 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
