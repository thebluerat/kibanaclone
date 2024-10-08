import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { IncomingMessage } from 'http';

// 파일 저장 경로 설정
const uploadDir = path.join(process.cwd(), '/public/uploads');

// 파일 업로드 디렉토리가 없으면 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일 업로드 핸들러
export async function POST(req: Request) {
  const form = new formidable.IncomingForm({
    multiples: true,
    uploadDir: uploadDir,
    keepExtensions: true,
  });

  return new Promise((resolve, reject) => {
    form.parse(req as unknown as IncomingMessage, (err, fields, files) => {
      if (err) {
        return reject(new Response('File upload error', { status: 500 }));
      }

      const uploadedFiles: Array<{ fileName: string; filePath: string }> = [];

      if (Array.isArray(files.files)) {
        uploadedFiles.push(
          ...files.files.map((file: File) => ({
            fileName: file.originalFilename || file.newFilename,
            filePath: `/uploads/${file.newFilename}`,
          }))
        );
      } else if (files.files) {
        const file = files.files as File;
        uploadedFiles.push({
          fileName: file.originalFilename || file.newFilename,
          filePath: `/uploads/${file.newFilename}`,
        });
      }

      resolve(NextResponse.json({ files: uploadedFiles }));
    });
  });
}

// GET 요청을 통한 업로드된 파일 목록 반환
export async function GET() {
  const files = fs.readdirSync(uploadDir).map((fileName) => {
    return { fileName, filePath: `/uploads/${fileName}` };
  });
  return NextResponse.json({ files });
}
