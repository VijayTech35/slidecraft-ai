import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import NotFoundPage from '@/pages/NotFoundPage';

const PresentationPage = lazy(() => import('@/pages/PresentationPage'));

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Suspense
          fallback={
            <div className="h-screen w-screen flex items-center justify-center bg-[#0f172a]">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm text-blue-200/70">Loading editor…</span>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/present/:id" element={<PresentationPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}
