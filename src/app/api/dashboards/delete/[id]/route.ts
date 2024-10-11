import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;  // URL 경로에서 id 가져오기
  const filePath = path.join(process.cwd(), 'data', 'dashboards', `${id}.json`);

  try {
    // 파일이 존재하는지 확인
    if (fs.existsSync(filePath)) {
      // 파일 삭제
      fs.unlinkSync(filePath);
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: '대시보드를 찾을 수 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('대시보드를 삭제하는 중 오류 발생:', error);
    return NextResponse.json({ error: '대시보드를 삭제하는 중 오류 발생' }, { status: 500 });
  }
}
