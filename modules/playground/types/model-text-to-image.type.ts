import { z } from 'zod';

export type ModelTag = 'inference' | 'commercial-use' | 'private' | 'optimized';

const MODELS_TEXT_TO_IMAGE_IDS = [
  'fal-ai/flux/dev',
  'fal-ai/flux/schnell',
  'fal-ai/flux-pro',
  'fal-ai/ideogram/v3',
  'fal-ai/flux-lora',
  'fal-ai/luma-photon',
  'fal-ai/dreamo',
  'fal-ai/imagen4/preview/fast',
  'fal-ai/imagen4/preview/ultra',
  'fal-ai/recraft/v3/text-to-image',
  'fal-ai/playground-v25',
  'fal-ai/realistic-vision',
] as const;

export const ModelTextToImageIdSchema = z.enum(MODELS_TEXT_TO_IMAGE_IDS);

export type ModelTextToImageId = z.infer<typeof ModelTextToImageIdSchema>;

type Model = {
  id: ModelTextToImageId;
  tags: readonly ModelTag[];
};

export const MODELS_TEXT_TO_IMAGE: readonly Model[] = [
  {
    id: 'fal-ai/flux/dev',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/flux/schnell',
    tags: ['inference', 'commercial-use', 'optimized'],
  },
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
    id: 'fal-ai/luma-photon',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/dreamo',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/imagen4/preview/fast',
    tags: ['inference', 'commercial-use', 'optimized'],
  },
  {
    id: 'fal-ai/imagen4/preview/ultra',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/recraft/v3/text-to-image',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/playground-v25',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/realistic-vision',
    tags: ['inference', 'commercial-use'],
  },
] as const;
