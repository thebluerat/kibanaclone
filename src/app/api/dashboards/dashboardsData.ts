// src/app/api/dashboards/dashboardsData.ts
import { loadDashboards } from './dashboardService';
import { Dashboard } from '../../../types/dashboard';

export let dashboards: Dashboard[] = loadDashboards(); // 파일에서 대시보드 로드
