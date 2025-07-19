import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpClient } from '@/lib/http-client';
import { ImageType, VideoType, MediaType } from '@/modules/playground/types/imageType';
import {
  OutputType,
  VideoOutputType,
  MediaOutputType,
} from '@/modules/playground/types/output.type';
import { addItemToLocalStorageGallery } from '@/lib/local-storage-gallery';

const mockedData = [
  {
    url: 'https://fal.media/files/rabbit/RFZAUBvNpUP222lMENJLG.png',
    width: 1024,
    height: 768,
    content_type: 'image/jpeg',
  },
] as MediaType[];

export const useMutationGenerateImages = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['generate'],
    mutationFn: async (data: FormData) => {
      // Use the optimized endpoint with fal.run for real-time performance
      const response = await httpClient.post<MediaOutputType>('/api/fal/optimized', data);
      const modelId = data.get('modelId') as string;

      let processedResponse: any;
      let mediaItems: MediaType[] = [];

      // Handle video response (for any model that returns a `video` field)
      if ('video' in response.data) {
        const videoResponse = response.data as VideoOutputType;
        const videoItem: VideoType = {
          ...videoResponse.video,
          // Ensure width/height fallback values if the API omits them
          width: videoResponse.video.width || Number(data.get('image_sizes_width')) || 1024,
          height: videoResponse.video.height || Number(data.get('image_sizes_height')) || 576,
          content_type: 'video/mp4',
        };
        mediaItems = [videoItem];
        processedResponse = {
          ...videoResponse,
          images: mediaItems, // Keep 'images' key for compatibility
        };
      }
      // Handle image response
      else {
        const imageResponse = response.data as any;
        // Get the requested dimensions from form data for accurate fallbacks
        const requestedWidth = Number(data.get('image_sizes_width')) || 1024;
        const requestedHeight = Number(data.get('image_sizes_height')) || 768;

        // Handle different response formats for different models
        let imagesArray: any[] = [];

        if (imageResponse?.images) {
          // Standard format: { images: [...] }
          imagesArray = imageResponse.images;
        } else if (imageResponse?.image) {
          // Single image format: { image: {...} }
          imagesArray = [imageResponse.image];
        } else if (Array.isArray(imageResponse)) {
          // Direct array format: [...]
          imagesArray = imageResponse;
        } else if (imageResponse?.url) {
          // Direct image object format: { url: "...", ... }
          imagesArray = [imageResponse];
        } else {
          console.warn('Unknown response format for model:', modelId, imageResponse);
          imagesArray = [];
        }

        // Ensure all images have width/height properties with accurate fallbacks
        mediaItems = imagesArray.map((image: any) => ({
          ...image,
          width: image.width || requestedWidth,
          height: image.height || requestedHeight,
          content_type: image.content_type || 'image/jpeg',
        }));

        processedResponse = {
          ...imageResponse,
          images: mediaItems,
        };
      }

      addItemToLocalStorageGallery({ ...processedResponse, date: new Date() });
      queryClient.setQueriesData(
        {
          queryKey: ['generated-images'],
        },
        mediaItems,
      );
      queryClient.refetchQueries({ queryKey: ['gallery'] });
      return processedResponse;
    },
  });

  return {
    ...mutation,
    data: {
      ...mutation.data,
      images: (mutation.data as any)?.images || mockedData,
    },
  };
};
