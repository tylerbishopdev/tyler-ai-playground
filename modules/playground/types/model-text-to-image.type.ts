import { z } from 'zod';

export type ModelTag =
  | 'inference'
  | 'commercial-use'
  | 'private'
  | 'optimized'
  | 'style-transfer'
  | 'video-generation'
  | 'fashion-photoshoot'
  | 'image-to-video';

const MODELS_TEXT_TO_IMAGE_IDS = [
  'fal-ai/ideogram/v3',
  'fal-ai/flux-pro',
  'fal-ai/flux-lora',
  'fal-ai/imagen4/preview/fast',
  'fal-ai/image-editing/style-transfer',
  'fal-ai/veo3/fast',
  'fal-ai/veo3/image-to-video',
  'easel-ai/fashion-photoshoot',
  'fal-ai/kling-video/v2.1/standard/image-to-video',
] as const;

export const ModelTextToImageIdSchema = z.enum(MODELS_TEXT_TO_IMAGE_IDS);

export type ModelTextToImageId = z.infer<typeof ModelTextToImageIdSchema>;

type Model = {
  id: ModelTextToImageId;
  tags: readonly ModelTag[];
};

export const MODELS_TEXT_TO_IMAGE: readonly Model[] = [
  {
    id: 'fal-ai/ideogram/v3',
    tags: ['inference', 'commercial-use'],
  },
  {
    id: 'fal-ai/flux-pro',
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
    id: 'fal-ai/image-editing/style-transfer',
    tags: ['inference', 'commercial-use', 'style-transfer'],
  },
  {
    id: 'fal-ai/veo3/fast',
    tags: ['inference', 'commercial-use', 'video-generation'],
  },
  {
    id: 'fal-ai/veo3/image-to-video',
    tags: ['inference', 'commercial-use', 'image-to-video'],
  },
  {
    id: 'easel-ai/fashion-photoshoot',
    tags: ['inference', 'commercial-use', 'fashion-photoshoot'],
  },
  {
    id: 'fal-ai/kling-video/v2.1/standard/image-to-video',
    tags: ['inference', 'commercial-use', 'image-to-video'],
  },
] as const;
