import { z } from 'zod';
import { ImageSizeSchema, ImageSizeSchemaEnum } from '@/modules/playground/types/imageType';

export const InputTypeSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required').describe('The prompt to generate an image from.'),
  image_size: ImageSizeSchemaEnum,
  image_sizes: ImageSizeSchema,
  selectedLora: z.string().optional().describe('Selected LoRA model ID or "none"'),
  num_inference_steps: z
    .number()
    .min(1)
    .step(1)
    .max(50)
    .optional()
    .describe('The number of inference steps to perform. Default value: 28'),
  guidance_scale: z
    .number()
    .min(1)
    .step(0.5)
    .max(20)
    .describe('Classifier free guidance scale Default value: 3.5'),
  seed: z
    .union([z.number().optional(), z.string().optional()])
    .describe(
      'The same seed and the same prompt given to the same version of the model will output the same image every time.',
    ),
  sync_mode: z
    .boolean()
    .optional()
    .describe(
      'If set to true, the function will wait for the image to be generated and uploaded before returning the response. This will increase the latency of the function but it allows you to get the image directly in the response without going through the CDN.',
    ),
  num_images: z
    .number()
    .min(1)
    .step(1)
    .max(4)
    .optional()
    .describe('The number of images to generate. Default value: 1'),
  enable_safety_checker: z
    .boolean()
    .optional()
    .describe('If set to true, the safety checker will be enabled. Default value: true'),
  // Style transfer specific fields
  image_url: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: 'Must be a valid URL or empty',
    })
    .describe('URL of the input image for style transfer. Required for style transfer models.'),
  safety_tolerance: z
    .enum(['1', '2', '3', '4', '5'])
    .optional()
    .describe('Safety tolerance level for style transfer. Default value: "2"'),
  output_format: z
    .enum(['jpeg', 'png'])
    .optional()
    .describe('Output format for the generated image. Default value: "jpeg"'),
  // Video generation specific fields
  aspect_ratio: z
    .enum(['16:9', '9:16', '1:1', '4:3', '3:4'])
    .optional()
    .describe('Aspect ratio for video generation. Default value: "16:9"'),
  duration: z
    .enum(['4s', '8s', '16s'])
    .optional()
    .describe('Duration of the generated video. Default value: "8s"'),
  enhance_prompt: z
    .boolean()
    .optional()
    .describe('Whether to enhance the prompt for better video generation. Default value: true'),
  generate_audio: z
    .boolean()
    .optional()
    .describe('Whether to generate audio for the video. Default value: true'),
  // Fashion photoshoot specific fields
  garment_image: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: 'Must be a valid URL or empty',
    })
    .describe(
      'URL of the garment image for fashion photoshoot. Required for fashion photoshoot model.',
    ),
  face_image: z
    .string()
    .optional()
    .refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
      message: 'Must be a valid URL or empty',
    })
    .describe(
      'URL of the face image for fashion photoshoot. Required for fashion photoshoot model.',
    ),
  gender: z
    .enum(['male', 'female'])
    .optional()
    .describe('Gender for the fashion photoshoot model. Default value: "male"'),
  body_size: z
    .enum(['XS', 'S', 'M', 'L', 'XL', 'XXL'])
    .optional()
    .describe('Body size for the fashion photoshoot model. Default value: "M"'),
  location: z
    .enum(['park', 'city'])
    .optional()
    .describe('Location setting for the fashion photoshoot. Default value: "park"'),
  // Image-to-video specific fields
  resolution: z
    .enum(['720p', '1080p'])
    .optional()
    .describe('Video resolution for image-to-video generation. Default value: "720p"'),
  video_length: z
    .enum(['3', '5', '10'])
    .optional()
    .describe('Duration in seconds for image-to-video generation. Default value: "5"'),
});

export type InputType = z.infer<typeof InputTypeSchema>;
