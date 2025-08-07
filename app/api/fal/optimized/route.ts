import * as fal from '@fal-ai/serverless-client';
import { ModelTextToImageId } from '@/modules/playground/types/model-text-to-image.type';
import { ImageSizeEnumType, IMAGE_SIZE_OPTIONS_MAPPER } from '@/modules/playground/types/imageType';
import { InputType } from '@/modules/playground/types/input.type';

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY || process.env.FAL_API_KEY,
});

export async function POST(request: Request) {
  try {
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

    // Style transfer specific fields
    const image_url = formData.get('image_url');
    const safety_tolerance = formData.get('safety_tolerance');
    const output_format = formData.get('output_format');

    // Debug logging for style transfer
    if (modelId === 'fal-ai/image-editing/style-transfer') {
      console.log('Style transfer API request:', {
        image_url,
        hasImageUrl: !!image_url,
        imageUrlLength: String(image_url || '').length,
        imageUrlTrimmed: String(image_url || '').trim(),
      });
    }

    // Video generation specific fields
    const aspect_ratio = formData.get('aspect_ratio');
    const duration = formData.get('duration');
    const enhance_prompt = formData.get('enhance_prompt');
    const generate_audio = formData.get('generate_audio');

    // Fashion photoshoot specific fields
    const garment_image = formData.get('garment_image');
    const face_image = formData.get('face_image');
    const gender = formData.get('gender');
    const body_size = formData.get('body_size');
    const location = formData.get('location');

    // Image-to-video specific fields
    const resolution = formData.get('resolution');
    const video_length = formData.get('video_length');
    const seed = formData.get('seed');

    // Veo3 image-to-video specific fields
    const veo3_duration = formData.get('duration'); // Already extracted as duration for Veo3

    // Define models that require queue processing
    const queueBasedModels = [
      'fal-ai/veo3/fast',
      'fal-ai/ideogram/character',
      'fal-ai/veo3/image-to-video',
      'easel-ai/fashion-photoshoot',
      'fal-ai/kling-video/v2.1/standard/image-to-video',
      'fal-ai/bytedance/seedance/v1/lite/image-to-video',
    ];

    let result;

    // Handle video generation model
    if (modelId === 'fal-ai/veo3/fast') {
      const body = {
        prompt: String(prompt || ''),
        aspect_ratio: String(aspect_ratio || '16:9'),
        duration: String(duration || '8s'),
        enhance_prompt: Boolean(enhance_prompt === 'true'),
        generate_audio: Boolean(generate_audio === 'true'),
      };

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle Ideogram Character (requires reference_image_urls)
    else if (modelId === 'fal-ai/ideogram/character') {
      // Must map our single image_url into reference_image_urls
      if (!image_url || !String(image_url).trim()) {
        return Response.json(
          { error: 'reference image is required for Ideogram Character model' },
          { status: 400 },
        );
      }

      const body = {
        prompt: String(prompt || ''),
        reference_image_urls: [String(image_url)],
        num_images: Number(num_images) || 1,
        expand_prompt: true,
      } as any;

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle Veo3 image-to-video model
    else if (modelId === 'fal-ai/veo3/image-to-video') {
      // This model REQUIRES image_url - it's not optional
      if (!image_url || !String(image_url).trim()) {
        return Response.json(
          { error: 'image_url is required for Veo3 image-to-video model' },
          { status: 400 },
        );
      }

      const body = {
        prompt: String(prompt || ''),
        image_url: String(image_url),
        duration: String(veo3_duration || '8s'), // Only 8s is supported
        generate_audio: Boolean(generate_audio === 'true'),
      };

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle fashion photoshoot model
    else if (modelId === 'easel-ai/fashion-photoshoot') {
      const body: any = {};

      // Only include non-empty values
      if (garment_image) body.garment_image = String(garment_image);
      if (face_image) body.face_image = String(face_image);
      if (gender) body.gender = String(gender);
      if (body_size) body.body_size = String(body_size);
      if (location) body.location = String(location);

      // Set defaults for required fields if not provided
      if (!body.gender) body.gender = 'male';
      if (!body.body_size) body.body_size = 'M';
      if (!body.location) body.location = 'park';

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle Kling video model - image_url is REQUIRED
    else if (modelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
      // This model REQUIRES image_url - it's not optional
      if (!image_url || !String(image_url).trim()) {
        return Response.json(
          { error: 'image_url is required for Kling video model' },
          { status: 400 },
        );
      }

      const body = {
        prompt: String(prompt || ''),
        image_url: String(image_url),
        duration: String(video_length || '5'),
      };

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle Bytedance Seedance image-to-video model
    else if ((modelId as string) === 'fal-ai/bytedance/seedance/v1/lite/image-to-video') {
      const body: any = {
        prompt: String(prompt || ''),
        // mandatory fields
        image_url: image_url ? String(image_url) : '',
      };

      // Optional parameters
      if (resolution) body.resolution = String(resolution);
      if (video_length) body.duration = String(video_length);
      if (seed) body.seed = Number(seed);
      if (formData.get('camera_fixed'))
        body.camera_fixed = Boolean(formData.get('camera_fixed') === 'true');

      result = await fal.subscribe(modelId, {
        input: body,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === 'IN_PROGRESS' && update.logs) {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });
    }
    // Handle style transfer model with real-time execution
    else if (modelId === 'fal-ai/image-editing/style-transfer') {
      // This model REQUIRES image_url - it's not optional
      if (!image_url || !String(image_url).trim()) {
        return Response.json(
          { error: 'image_url is required for Style Transfer model' },
          { status: 400 },
        );
      }

      const body = {
        prompt: String(prompt || ''),
        image_url: String(image_url),
        guidance_scale: Number(guidance_scale) || 3.5,
        num_inference_steps: Number(num_inference_steps) || 30,
        safety_tolerance: String(safety_tolerance || '2'),
        output_format: String(output_format || 'jpeg') as 'jpeg' | 'png',
      };

      // Use fal.run for real-time execution
      result = await fal.run(modelId, {
        input: body,
      });
    }
    // Handle text-to-image models with real-time execution
    else {
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
      const body: Omit<
        InputType,
        | 'image_sizes'
        | 'image_size'
        | 'selectedLora'
        | 'image_url'
        | 'safety_tolerance'
        | 'output_format'
      > & {
        image_size?: InputType['image_size'] | InputType['image_sizes'];
        width?: number;
        height?: number;
        loras: any[];
        image_url?: string;
      } = {
        prompt: String(prompt || ''),
        num_inference_steps: Number(num_inference_steps) || 28,
        guidance_scale: Number(guidance_scale) || 3.5,
        num_images: Number(num_images) || 1,
        enable_safety_checker: Boolean(enable_safety_checker === 'true'),
        sync_mode: Boolean(sync_mode === 'true'),
        loras: loras ? JSON.parse(String(loras)) : [],
      };

      // Only include image_url if it's provided and not empty
      if (image_url && String(image_url).trim()) {
        body.image_url = String(image_url);
      }

      // Some models prefer image_size, others prefer width/height - provide both
      if (['fal-ai/flux-pro', 'fal-ai/imagen4/preview/fast'].includes(modelId)) {
        // These models prefer explicit width/height
        body.width = imageDimensions.width;
        body.height = imageDimensions.height;
      } else {
        // Flux models and others can use image_size
        body.image_size = imageDimensions;
      }

      // Use fal.run for real-time execution (much faster!)
      result = await fal.run(modelId || 'fal-ai/ideogram/v3', {
        input: body,
      });
    }

    return Response.json(result);
  } catch (error) {
    console.error('FAL API Error:', error);

    // Enhanced error handling with detailed messages
    if (error && typeof error === 'object') {
      // FAL-specific error handling
      if ('body' in error && error.body) {
        console.error('Error body:', JSON.stringify(error.body, null, 2));
        const errorBody = error.body as any;

        // Return more specific error messages
        if (errorBody.detail) {
          return Response.json(
            { error: errorBody.detail, code: 'FAL_API_ERROR' },
            { status: errorBody.status || 400 },
          );
        }
      }

      // Handle validation errors
      if ('message' in error && typeof error.message === 'string') {
        if (error.message.includes('required')) {
          return Response.json({ error: error.message, code: 'VALIDATION_ERROR' }, { status: 400 });
        }
      }
    }

    // Generic error response
    return Response.json(
      {
        error: 'Failed to generate content. Please try again.',
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    );
  }
}
