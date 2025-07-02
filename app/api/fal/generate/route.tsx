import * as fal from '@fal-ai/serverless-client';
import { ModelTextToImageId } from '@/modules/playground/types/model-text-to-image.type';
import { ImageSizeEnumType, IMAGE_SIZE_OPTIONS_MAPPER } from '@/modules/playground/types/imageType';
import { InputType } from '@/modules/playground/types/input.type';

export async function POST(request: Request) {
  const formData = await request.formData();

  const modelId = formData.get('modelId') as ModelTextToImageId;
  const prompt = formData.get('prompt');
  const num_inference_steps = formData.get('num_inference_steps');
  const guidance_scale = formData.get('guidance_scale');
  const num_images = formData.get('num_images');
  const enable_safety_checker = formData.get('enable_safety_checker');
  const sync_mode = formData.get('sync_mode');
  const image_size = formData.get('image_size') as ImageSizeEnumType;
  const image_sizes_width = formData.get('image_sizes_width');
  const image_sizes_height = formData.get('image_sizes_height');
  const loras = formData.get('loras');

  // Always convert to width/height object - some models require explicit dimensions
  const getImageDimensions = () => {
    if (image_size === 'custom') {
      return {
        width: Number(image_sizes_width) || 1024,
        height: Number(image_sizes_height) || 768,
      };
    }

    // Get preset dimensions from mapper
    const presetDimensions = IMAGE_SIZE_OPTIONS_MAPPER[image_size || 'landscape_4_3'];
    return {
      width: presetDimensions?.width || 1024,
      height: presetDimensions?.height || 768,
    };
  };

  const imageDimensions = getImageDimensions();

  // Build the request body with model-specific requirements
  const body: Omit<InputType, 'image_sizes' | 'image_size' | 'selectedLora'> & {
    image_size?: InputType['image_size'] | InputType['image_sizes'];
    width?: number;
    height?: number;
    loras: any[];
  } = {
    prompt: String(prompt || ''),
    num_inference_steps: Number(num_inference_steps) || 28,
    guidance_scale: Number(guidance_scale) || 3.5,
    num_images: Number(num_images) || 1,
    enable_safety_checker: Boolean(enable_safety_checker === 'true'),
    sync_mode: Boolean(sync_mode === 'true'),
    loras: loras ? JSON.parse(String(loras)) : [],
  };

  // Some models prefer image_size, others prefer width/height - provide both
  if (['fal-ai/ideogram/v3', 'fal-ai/imagen4/preview/fast', 'fal-ai/imagen4/preview/ultra', 'fal-ai/recraft/v3/text-to-image', 'fal-ai/playground-v25', 'fal-ai/realistic-vision'].includes(modelId)) {
    // These models prefer explicit width/height
    body.width = imageDimensions.width;
    body.height = imageDimensions.height;
  } else {
    // Flux models and others can use image_size
    body.image_size = imageDimensions;
  }

  const result = await fal.subscribe(modelId || 'fal-ai/flux/dev', {
    input: body,
    logs: false,
  });

  return Response.json(result);
}
