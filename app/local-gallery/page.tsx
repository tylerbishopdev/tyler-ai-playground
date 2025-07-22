import { Gallery } from '@/modules/gallery/gallery';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function LocalGalleryPage() {

  return (
    <div className="container">
      <div className="flex justify-start py-10 px-20">
        <Button asChild className="text-primary border-primary/50 border hover:bg-secondary/50 hover:text-secondary hover:border-secondary/60"><Link href="/" className="text-primary font-newake text-2xl border-primary bg-primary/20">Back</Link></Button>
      </div>

      <div className="w-full max-w-7xl mx-auto h-auto overflow-auto">
        <Gallery />
      </div>
    </div>

  );
}
