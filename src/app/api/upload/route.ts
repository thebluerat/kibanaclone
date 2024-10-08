import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 업로드할 디렉토리 경로
const uploadDir = path.join(process.cwd(), 'public/uploads');

// 디렉토리가 존재하지 않으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST 핸들러
export async function POST(req: Request) {
  // 파일을 FormData에서 읽어옵니다.
  const formData = await req.formData();
  const file = formData.get('file');

  // 파일이 없으면 오류 반환
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // UUID를 사용하여 파일명 생성
  const newFilename = `${uuidv4()}_${file.name}`;
  const filePath = path.join(uploadDir, newFilename);

  // 파일 저장
  const buffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));

  return NextResponse.json({ filePath: `/uploads/${newFilename}` });
}

// GET 핸들러 (파일 목록 반환)
export async function GET() {
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  const files = fs.readdirSync(uploadDir).map((file) => ({
    fileName: file,
    filePath: `/uploads/${file}`,
  }));

  return NextResponse.json({ files });
}
