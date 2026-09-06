import { useNavigate } from 'react-router-dom';
import { Presentation, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-500/25 flex items-center justify-center">
          <Presentation className="w-8 h-8 text-white" />
        </div>
        <p className="text-sm font-semibold text-violet-400 tracking-widest mb-2">404</p>
        <h1 className="text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-lg shadow-violet-500/20"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
      </div>
    </div>
  );
}