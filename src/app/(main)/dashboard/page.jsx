'use client';

import React, { useState } from 'react'; // useState 추가
import { useRouter } from 'next/navigation';
import AddFromLibrary from '../dashboard/addFromLibrary/page';

const Dashboard = () => {
  const router = useRouter(); // useRouter 훅 사용
  const [showLibraryModal, setShowLibraryModal] = useState(false); // 라이브러리 모달 상태 추가

  return (
    <div className="flex flex-col min-h-screen">
      <nav className="bg-gray-200 p-4">
        <h1 className="text-lg font-bold">대시보드</h1>
        <ul className="mt-2">
          <li className="cursor-pointer" onClick={() => router.push('/createVisualization')}>
            차트 만들기
          </li>
          <li
            className="cursor-pointer"
            onClick={() => setShowLibraryModal(true)} // 라이브러리에서 추가 버튼 클릭 시 모달 표시
          >
            라이브러리에서 추가
          </li>
        </ul>
      </nav>
      
      {/* 기존 대시보드 내용 */}
      {/* ... */}

      {/* 라이브러리에서 추가 모달 */}
      {showLibraryModal && (
        <AddFromLibrary onClose={() => setShowLibraryModal(false)} /> // 모달 닫기 핸들러
      )}
    </div>
  );
};

export default Dashboard;
