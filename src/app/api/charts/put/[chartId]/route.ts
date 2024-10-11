import { NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const chartsPath = path.join(process.cwd(), 'public/charts');

export async function PUT(req: Request, { params }: { params: { chartId: string } }) {
  const { chartId } = params;

  try {
    const body = await req.json();
    const { data, chartType, xAxis, yAxes, yAxisSettings, pieSettings } = body;

    // 차트 데이터가 없으면 에러 반환
    if (!data || !chartType || !xAxis || !yAxes) {
      return NextResponse.json({ message: '필수 차트 데이터가 누락되었습니다.' }, { status: 400 });
    }

    const chartFilePath = path.join(chartsPath, `${chartId}.json`);

    // 기존 차트 데이터 가져오기
    const existingChart = await readFile(chartFilePath, 'utf8');
    const parsedChart = JSON.parse(existingChart);

    // 차트 데이터 업데이트
    const updatedChart = {
      ...parsedChart,
      data,
      chartType,
      xAxis,
      yAxes,
      yAxisSettings,
      pieSettings,
    };

    // 업데이트된 차트 데이터를 다시 파일에 저장
    await writeFile(chartFilePath, JSON.stringify(updatedChart, null, 2));

    return NextResponse.json({ message: '차트 데이터가 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('차트 데이터 업데이트 오류:', error);
    return NextResponse.json({ message: '차트 데이터 업데이트에 실패했습니다.' }, { status: 500 });
  }
}
