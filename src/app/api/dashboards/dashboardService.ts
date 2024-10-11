// src/app/api/dashboards/dashboardService.ts
import fs from 'fs';
import path from 'path';
import { Dashboard } from '../../../../src/types/dashboard';

const filePath = path.join(process.cwd(), 'dashboards.json');

// 대시보드 데이터를 파일에서 읽어오는 함수
export const loadDashboards = (): Dashboard[] => {
  if (!fs.existsSync(filePath)) {
    return []; // 파일이 없으면 빈 배열 반환
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data) as Dashboard[];
};

// 대시보드 데이터를 파일에 저장하는 함수
export const saveDashboards = (dashboards: Dashboard[]) => {
  fs.writeFileSync(filePath, JSON.stringify(dashboards, null, 2));
};
