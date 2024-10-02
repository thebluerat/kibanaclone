import { ReactNode } from 'react';
import './globals.css';

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          <aside className="w-64 bg-gray-800 text-white">
            <div className="p-4">Sidebar</div>
          </aside>
          <main className="flex-1 p-6 bg-gray-100">
            {children} {/* 각 페이지의 콘텐츠가 이곳에 렌더링됩니다 */}
          </main>
        </div>
      </body>
    </html>
  );
}
