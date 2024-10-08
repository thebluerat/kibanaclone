import React from 'react';

interface TopBarProps {
    toggleSidebar: () => void; // toggleSidebar 함수의 타입 정의
  }

  const TopBar: React.FC<TopBarProps> = ({ toggleSidebar }) => {
  return (
    <div className="w-full h-12 bg-gray-700 text-white flex items-center justify-between px-4 fixed top-0 z-50">
      {/* 사이드바 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        className="bg-gray-800 text-white p-2 rounded"
      >
        메뉴
      </button>

      {/* 나중에 페이지별 메뉴나 제목이 들어갈 공간 */}
      <div className="ml-4">
        <h1 className="text-lg">페이지 제목</h1> {/* 나중에 변경 가능 */}
      </div>
    </div>
  );
};

export default TopBar;
