import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageType } from '@/modules/playground/types/imageType';
import Image from 'next/image';
import { TrashIcon } from 'lucide-react';
import { MouseEventHandler, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { removeItemFromLocalStorageGallery } from '@/lib/local-storage-gallery';
import { useQueryClient } from '@tanstack/react-query';

type Props = ImageType;

export const ImageDialog = (props: Props) => {
  const queryClient = useQueryClient();
  const [removing, setRemoving] = useState<boolean>(false);

  const onTrashClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setRemoving(true);
  };

  const onRemoveItem: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    removeItemFromLocalStorageGallery(props.url);
    await queryClient.refetchQueries({ queryKey: ['gallery'] });
    setRemoving(false);
  };

  const onRemoveCancel: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setRemoving(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative h-full cursor-pointer">
            <div className="relative h-full w-full overflow-hidden">
              <Image
                loading="lazy"
                src={props.url}
                key={props.url}
                alt={props.url}
                width={props.width}
                height={props.height}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder={
                  'data:image/webp;base64,UklGRkoAAABXRUJQVlA4ID4AAACQAQCdASoFAAkAAgA0JQBOgB5mBMAA/vb+b7r9JZtxmbmmj6Uh84+Ae4Y0icG/BE66GlLYlAvJDRWsCR8AAA=='
                }
              />
            </div>
            <Button
              variant="ghost"
              className="absolute right-3 top-3 bg-background/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity border border-border hover:bg-destructive hover:text-destructive-foreground"
              onClick={onTrashClick}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <AlertDialog open={removing}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Image</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this image? This action cannot be undone and will permanently remove the image from your local storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={onRemoveCancel}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onRemoveItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
            <DialogDescription className="font-mono text-xs">
              {props.width} × {props.height} • {props.content_type}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center">
            <Image
              src={props.url}
              alt={props.url}
              width={props.width}
              height={props.height}
              className="h-auto max-h-[80vh] w-auto max-w-full border border-border"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
