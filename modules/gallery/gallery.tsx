'use client';

import { useQueryGallery } from '@/modules/gallery/hooks/use-query-gallery';
import { useMemo } from 'react';
import {
  Gallery as GalleryComponent,
  Image as ImageGalleryType,
  ThumbnailImageProps,
} from 'react-grid-gallery';
import { MediaDialog } from '@/components/media-dialog';
import { AlertTriangle } from 'lucide-react';

const ImageComponent = (props: ThumbnailImageProps) => {
  return (
    <MediaDialog
      {...props.imageProps}
      url={props.imageProps.src}
      content_type={'image/jpeg'}
      width={props.item.width}
      height={props.item.height}
    />
  );
};

export const Gallery = () => {
  const { data } = useQueryGallery();

  const imagesList = useMemo(() => data?.flatMap((x) => x.images), [data]);

  const hasNoData = imagesList?.length === 0;

  const imagesListToGalleryComponent: ImageGalleryType[] = (imagesList || []).map((x) => ({
    src: x.url,
    width: x.width,
    height: x.height,
    content_type: x.content_type,
  }));

  return (
    <div className="container h-full w-full">

      {hasNoData && (
        <div className="flex justify-center py-8 border border-accent max-w-xl mx-auto bg-accent/70 rounded-lg ">


          <AlertTriangle className="w-10 h-10 mx-auto pb-2 " />
          <h2 className="text-xl font-bold font-newake tracking-tight">  Images stored in browser </h2>

          <p className="text-sm pt-4 font-mono max-w-xl px-8">
            Clearing browser cache deletes your gallery. You dont have to login to save
            images and they&apos;re only stored on your device, but all are deleted
            forever once browser history is cleared unless you save them.
          </p>
        </div>
      )}

      <GalleryComponent
        enableImageSelection={false}
        rowHeight={300}
        images={imagesListToGalleryComponent}
        thumbnailImageComponent={ImageComponent}
      />
    </div >
  );
};