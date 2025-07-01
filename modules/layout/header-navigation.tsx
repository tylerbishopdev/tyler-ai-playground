'use client';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const paths = {
  home: '/',
  localGallery: '/local-gallery',
} as const;

interface HeaderNavigationProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const HeaderNavigation = ({ orientation = 'horizontal', className }: HeaderNavigationProps) => {
  const pathname = usePathname();

  const getActiveClass = (key: keyof typeof paths) => {
    return pathname === paths[key];
  };

  return (
    <nav className={cn(
      'flex',
      orientation === 'horizontal' ? 'flex-row space-x-1' : 'flex-col space-y-1',
      className
    )}>
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'font-medium justify-start',
          getActiveClass('home') && 'bg-accent font-semibold'
        )}
        href={paths.home}
      >
        Generate images
      </Link>
      <Link
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'font-medium justify-start',
          getActiveClass('localGallery') && 'bg-accent font-semibold'
        )}
        href={paths.localGallery}
      >
        Local gallery
      </Link>
    </nav>
  );
};
