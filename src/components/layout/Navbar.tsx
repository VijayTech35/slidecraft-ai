import { Layers, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  onNavigate?: (path: string) => void;
}

const links = [
  { label: 'Features', href: '#features' },
  { label: 'Templates', href: '#templates' },
];

export default function Navbar({ onNavigate }: NavbarProps) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div
          className={cn(
            'mt-3 flex items-center justify-between gap-4 px-5 py-3 rounded-2xl',
            'bg-[#18181b]/70 backdrop-blur-xl border border-white/[0.06]',
            'shadow-lg shadow-black/20'
          )}
        >
          {/* Logo */}
          <button
            onClick={() => onNavigate?.('/')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[15px] tracking-tight text-white">
              SlideCraft AI
            </span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={() => onNavigate?.('/')}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium',
              'bg-gradient-to-r from-violet-600 to-fuchsia-600',
              'hover:from-violet-500 hover:to-fuchsia-500',
              'text-white shadow-md shadow-violet-500/20',
              'transition-all duration-200 cursor-pointer'
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Presentation</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
