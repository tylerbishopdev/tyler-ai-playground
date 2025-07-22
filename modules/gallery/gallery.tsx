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
    <div className="container">

      {hasNoData && (
        <div className="flex flex-col justify-center py-8 border border-accent/50 rounded-xl max-w-xl mx-auto bg-accent/10  ">


          <AlertTriangle className="w-10 h-10 mx-auto pb-2 text-accent" />
          <h2 className="text-xl text-center mx-auto font-neuve tracking-wide text-accent">  Images Stored In Browser Cache</h2>

          <p className="text-xs text-center pt-4 font-mono max-w-xl px-8">
            Your generated images are all stored here automatically via your devices browser cache, but all are deleted
            forever once browser history is cleared  for this site unless downloaded.
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