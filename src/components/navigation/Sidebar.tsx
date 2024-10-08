import React from 'react';
import Link from 'next/link';

interface SidebarProps {
    isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
    return (
        <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform transform ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 z-40`}
        >
            <div className="p-4">
                <h1 className="text-lg font-bold">메뉴</h1>
            </div>
            <nav>
                <ul>
                    <li className="p-2 hover:bg-gray-700">
                        <Link href="/">홈</Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <Link href="/dashboard">대시보드</Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <Link href="/index">인덱스</Link>
                    </li>
                    <li className="p-2 hover:bg-gray-700">
                        <Link href="/visualizationlibrary">시각화 라이브러리</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;
