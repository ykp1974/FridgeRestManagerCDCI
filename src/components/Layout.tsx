import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

/**
 * 基本レイアウトコンポーネント
 */
export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            🥬 冷蔵庫レシピ管理
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            食材の賞味期限を管理して、レシピをすぐ検索
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
        <p>データはブラウザのLocalStorageに保存されます</p>
      </footer>
    </div>
  );
}
