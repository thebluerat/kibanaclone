'use client';

import { ReactNode, useState } from 'react';
import './globals.css';
import Sidebar from '../components/navigation/Sidebar';
import TopBar from '../components/navigation/TopBar';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <body>
        <div className="relative">
          <TopBar toggleSidebar={toggleSidebar} /> {/* TopBar 추가 */}
          <Sidebar isOpen={isSidebarOpen} /> {/* Sidebar 추가 */}
          <main className="pt-12 p-6 bg-gray-100 min-h-screen">
            {children} {/* 각 페이지의 콘텐츠 */}
          </main>
        </div>
      </body>
    </html>
  );
}