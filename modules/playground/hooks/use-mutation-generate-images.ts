import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/lib/http-client';
import { ImageType } from '@/modules/playground/types/imageType';
import { OutputType } from '@/modules/playground/types/output.type';
import { addItemToLocalStorageGallery } from '@/lib/local-storage-gallery';

const mockedData = [
  {
    url: 'https://fal.media/files/rabbit/RFZAUBvNpUP222lMENJLG.png',
    width: 1024,
    height: 768,
    content_type: 'image/jpeg',
  },
] as ImageType[];

export const useMutationGenerateImages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (data: FormData) => {
      const response = await httpClient.post<OutputType>('/api/fal/generate', data);

      // Get the requested dimensions from form data for accurate fallbacks
      const requestedWidth = Number(data.get('image_sizes_width')) || 1024;
      const requestedHeight = Number(data.get('image_sizes_height')) || 768;

      // Ensure all images have width/height properties with accurate fallbacks
      const processedResponse = {
        ...response.data,
        images: (response.data?.images || []).map((image: any) => ({
          ...image,
          width: image.width || requestedWidth,
          height: image.height || requestedHeight,
          content_type: image.content_type || 'image/jpeg',
        })),
      };

      addItemToLocalStorageGallery({ ...processedResponse, date: new Date() });
      queryClient.setQueriesData(
        {
          queryKey: ['generated-images'],
        },
        processedResponse.images || [],
      );
      queryClient.refetchQueries({ queryKey: ['gallery'] });
      return processedResponse;
    },
  });

  return {
    ...mutation,
    data: {
      ...mutation.data,
      images: mutation.data?.images || mockedData,
    },
  };
};
