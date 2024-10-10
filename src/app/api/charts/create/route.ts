import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const chartsDir = path.join(process.cwd(), 'public', 'charts');

export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { name, data } = body;
  
      if (!name || !data) {
        return NextResponse.json({ error: '차트 이름과 데이터가 필요합니다.' }, { status: 400 });
      }
  
      // 이중 따옴표를 제거하기 위한 코드 추가
      const sanitizedData = JSON.stringify(data, (key, value) => {
        if (typeof value === 'string') {
          return value.replace(/"{2}/g, '"');  // 이중 따옴표를 하나의 따옴표로 변경
        }
        return value;
      }, 2);
  
      const filePath = path.join(chartsDir, `${name}.json`);
  
      if (fs.existsSync(filePath)) {
        return NextResponse.json({ error: '동일한 이름의 차트가 이미 존재합니다.' }, { status: 400 });
      }
  
      fs.writeFileSync(filePath, sanitizedData);
  
      return NextResponse.json({ message: '차트가 성공적으로 저장되었습니다.' }, { status: 201 });
    } catch (error) {
      console.error('Error saving chart:', error);
      return NextResponse.json({ error: '차트를 저장하는 데 실패했습니다.' }, { status: 500 });
    }
  }
  