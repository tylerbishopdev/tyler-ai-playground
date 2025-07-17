import { z } from 'zod';

export type ModelTag = 'inference' | 'commercial-use' | 'private' | 'optimized' | 'style-transfer';

const MODELS_TEXT_TO_IMAGE_IDS = [
  'fal-ai/flux-pro',
  'fal-ai/ideogram/v3',
  'fal-ai/flux-lora',
  'fal-ai/imagen4/preview/fast',
  'fal-ai/recraft/v3/text-to-image',
  'fal-ai/image-editing/style-transfer',
] as const;

export const ModelTextToImageIdSchema = z.enum(MODELS_TEXT_TO_IMAGE_IDS);

export type ModelTextToImageId = z.infer<typeof ModelTextToImageIdSchema>;

type Model = {
  id: ModelTextToImageId;
  tags: readonly ModelTag[];
};

export const MODELS_TEXT_TO_IMAGE: readonly Model[] = [
  {
    id: 'fal-ai/flux-pro',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/ideogram/v3',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/flux-lora',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/imagen4/preview/fast',
    tags: ['inference', 'commercial-use', 'optimized'],
  },
  {
    id: 'fal-ai/recraft/v3/text-to-image',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/image-editing/style-transfer',
    tags: ['inference', 'commercial-use', 'style-transfer'],
  },
] as const;
