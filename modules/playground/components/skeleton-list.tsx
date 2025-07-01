import { Skeleton } from '@/components/ui/skeleton';
import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FormType } from '@/modules/playground/types/form.type';
import { IMAGE_SIZE_OPTIONS_MAPPER } from '@/modules/playground/types/imageType';
import { AspectRatio } from '@/components/ui/aspect-ratio';

type Props = { isPending: boolean };

export const SkeletonList = (props: Props) => {
  const form = useFormContext<FormType>();

  const numOfImages = useWatch({
    control: form.control,
    name: 'num_images',
  });

  const sizeOfImage = useWatch({
    control: form.control,
    name: 'image_size',
  });

  const sizesOfImage = useWatch({
    control: form.control,
    name: 'image_sizes',
  });

  const imageSize =
    sizeOfImage !== 'custom'
      ? IMAGE_SIZE_OPTIONS_MAPPER[sizeOfImage]
      : { width: sizesOfImage.width, height: sizesOfImage.height };

  return (
    <>
      {props.isPending &&
        new Array(numOfImages).fill(null).map((_, index) => (
          <div
            key={index}
            className="relative bg-card border border-border"
          >
            <AspectRatio
              ratio={(imageSize.width || 100) / (imageSize.height || 100)}
              className="rounded-none"
            >
              <Skeleton className="w-full h-full rounded-none object-cover" />
            </AspectRatio>
            <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 text-xs font-mono border border-border">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-muted-foreground text-sm font-mono">
                Generating...
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
