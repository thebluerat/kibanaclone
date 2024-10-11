'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const router = useRouter();
  const [dashboards, setDashboards] = useState([]); // 대시보드 목록 초기화

  // 대시보드 목록을 가져오는 함수
  const fetchDashboards = async () => {
    try {
      const response = await fetch('/api/dashboards'); // GET API 호출 (수정된 경로)
      if (response.ok) {
        const data = await response.json();
        setDashboards(data); // 대시보드 목록 설정
      } else {
        console.error('대시보드 목록 가져오기 실패');
      }
    } catch (error) {
      console.error('대시보드 목록을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchDashboards(); // 컴포넌트가 로드될 때 대시보드 목록을 가져옴
  }, []);

  const handleDeleteDashboard = async (id) => {
    try {
      const response = await fetch(`/api/dashboards/delete/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (result.success) {
        console.log('대시보드가 성공적으로 삭제되었습니다.');

        // 삭제 후 대시보드 목록에서 해당 대시보드를 제거
        setDashboards((prevDashboards) =>
          prevDashboards.filter((dashboard) => dashboard.id !== id)
        );
      } else {
        console.error(result.error);
      }
    } catch (error) {
      console.error('대시보드 삭제 중 오류 발생:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-200 p-4">
        <h1 className="text-lg font-bold">대시보드 관리</h1>
        <ul className="mt-2">
          <li className="cursor-pointer" onClick={() => router.push('/createVisualization')}>
            차트 만들기
          </li>
        </ul>
      </nav>

      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">대시보드 목록</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">대시보드 이름</th>
              <th className="py-2 px-4 border-b">차트 개수</th>
              <th className="py-2 px-4 border-b">작업</th>
            </tr>
          </thead>
          <tbody>
            {dashboards.length > 0 ? (
              dashboards.map((dashboard) => (
                <tr key={dashboard.id}>
                  <td className="py-2 px-4 border-b">
                    <span
                      className="cursor-pointer text-blue-600 hover:underline"
                      onClick={() => router.push(`/dashboard/${dashboard.id}`)}
                    >
                      {dashboard.name}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b text-center">{dashboard.charts.length}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => handleDeleteDashboard(dashboard.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center py-4">저장된 대시보드가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
