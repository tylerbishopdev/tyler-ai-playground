'use client';

import { Button } from '@/components/ui/button';
import * as React from 'react';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import { useMutationGenerateImages } from './hooks/use-mutation-generate-images';
import { FormType } from './types/form.type';
import { FieldPrompt } from './components/field-prompt';
import { FieldModelId } from '@/modules/playground/components/field-model';
import { FieldNumberOfImages } from '@/modules/playground/components/field-number-of-images';
import { MediaDialog } from '@/components/media-dialog';
import { FieldSeed } from '@/modules/playground/components/field-seed';
import { FieldImageSize } from '@/modules/playground/components/field-image-size';
import { useQueryGeneratedImages } from '@/modules/playground/hooks/use-query-generated-images';
import { SkeletonList } from '@/modules/playground/components/skeleton-list';
import { FieldLora, LORA_MODELS } from '@/modules/playground/components/field-lora';
import { FieldImageUpload } from '@/modules/playground/components/field-image-upload';
import { FieldAspectRatio } from '@/modules/playground/components/field-aspect-ratio';
import { FieldDuration } from '@/modules/playground/components/field-duration';
import { FieldEnhancePrompt } from '@/modules/playground/components/field-enhance-prompt';
import { FieldGenerateAudio } from '@/modules/playground/components/field-generate-audio';
import { FieldGarmentImage } from '@/modules/playground/components/field-garment-image';
import { FieldFaceImage } from '@/modules/playground/components/field-face-image';
import { FieldGender } from '@/modules/playground/components/field-gender';
import { FieldBodySize } from '@/modules/playground/components/field-body-size';
import { FieldLocation } from '@/modules/playground/components/field-location';

import { FieldResolution } from '@/modules/playground/components/field-resolution';
import { FieldVideoDuration } from '@/modules/playground/components/field-video-duration';

// Client-only wrapper to prevent hydration issues
const ClientOnlyWrapper = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

// Form component for the sidebar
export const PlaygroundForm = () => {
  const { mutateAsync, isPending } = useMutationGenerateImages();
  const form = useFormContext<FormType>();

  const submit = async (body: FormType) => {
    const data = new FormData();

    // Set model-specific defaults for optimal performance
    let inferenceSteps = 28;
    let guidanceScale = 3.5;

    switch (body.modelId) {

      case 'fal-ai/ideogram/v3':
        inferenceSteps = 30;
        guidanceScale = 7.5;
        break;
      case 'fal-ai/flux-pro':
        inferenceSteps = 25;
        guidanceScale = 3.5;
        break;
      case 'fal-ai/imagen4/preview/fast':
        inferenceSteps = 20;
        guidanceScale = 2.5;
        break;
      case 'fal-ai/image-editing/style-transfer':
        inferenceSteps = 30;
        guidanceScale = 3.5;
        break;
      case 'easel-ai/fashion-photoshoot':
        // Fashion photoshoot doesn't use inference steps or guidance scale
        break;
      case 'fal-ai/veo3/fast':
        // Video generation doesn't use inference steps or guidance scale
        break;
      case 'fal-ai/kling-video/v2.1/standard/image-to-video':
        // Image-to-video doesn't use inference steps or guidance scale
        break;
      default: // fal-ai/flux-lora
        inferenceSteps = body.num_inference_steps || 28;
        guidanceScale = body.guidance_scale || 3.5;
        break;
    }

    data.set('modelId', body.modelId);
    data.set('enable_safety_checker', String(false));
    data.set('guidance_scale', String(guidanceScale));
    data.set('num_images', String(body.num_images));
    data.set('num_inference_steps', String(inferenceSteps));
    data.set('prompt', body.prompt);
    data.set('seed', String(body.seed));
    data.set('sync_mode', String(body.sync_mode));

    // Video generation specific fields
    if (body.modelId === 'fal-ai/veo3/fast') {
      data.set('aspect_ratio', body.aspect_ratio || '16:9');
      data.set('duration', body.duration || '8s');
      data.set('enhance_prompt', String(body.enhance_prompt ?? true));
      data.set('generate_audio', String(body.generate_audio ?? true));
      // Don't set image size fields for video generation
    }
    // Style transfer specific fields
    else if (body.modelId === 'fal-ai/image-editing/style-transfer') {
      // Only set image_url if it has a value
      if (body.image_url && body.image_url.trim()) {
        data.set('image_url', body.image_url);
      }
      data.set('safety_tolerance', body.safety_tolerance || '2');
      data.set('output_format', body.output_format || 'jpeg');
      // Don't set image size fields for style transfer
    }
    // Fashion photoshoot specific fields
    else if (body.modelId === 'easel-ai/fashion-photoshoot') {
      // Only set image fields if they have values
      if (body.garment_image && body.garment_image.trim()) {
        data.set('garment_image', body.garment_image);
      }
      if (body.face_image && body.face_image.trim()) {
        data.set('face_image', body.face_image);
      }
      data.set('gender', body.gender || 'male');
      data.set('body_size', body.body_size || 'M');
      data.set('location', body.location || 'park');
      // Don't set image size fields for fashion photoshoot
    }
    // Image-to-video specific fields
    else if (body.modelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
      // Validate that image_url is required for Kling video model
      if (!body.image_url || !body.image_url.trim()) {
        form.setError('image_url', {
          type: 'manual',
          message: 'Image URL is required for Kling video model',
        });
        return;
      }
      data.set('image_url', body.image_url);
      data.set('duration', body.video_length || '5');
      // Don't set image size fields for image-to-video
    } else {
      // Regular text-to-image models
      data.set('image_size', body.image_size);
      data.set('image_sizes_width', String(body.image_sizes?.width || 200));
      data.set('image_sizes_height', String(body.image_sizes?.height || 200));
    }

    // Only add LoRA if flux-lora model is selected and a LoRA is chosen
    if (body.modelId === 'fal-ai/flux-lora' && body.selectedLora && body.selectedLora !== 'none') {
      const selectedLoraModel = LORA_MODELS.find(lora => lora.id === body.selectedLora);

      if (selectedLoraModel) {
        const loraConfig = [{
          path: selectedLoraModel.path,
          weight: selectedLoraModel.weight,
          scale: selectedLoraModel.scale
        }];
        data.set('loras', JSON.stringify(loraConfig));
      }
    } else {
      // If not flux-lora model or no LoRA selected, send empty array
      data.set('loras', JSON.stringify([]));
    }

    await mutateAsync(data);
  };

  const watchedModelId = form.watch('modelId');
  const isFluxLoraModel = watchedModelId === 'fal-ai/flux-lora';
  const isStyleTransferModel = watchedModelId === 'fal-ai/image-editing/style-transfer';
  const isVideoGenerationModel = watchedModelId === 'fal-ai/veo3/fast';
  const isFashionPhotoshootModel = watchedModelId === 'easel-ai/fashion-photoshoot';
  const isImageToVideoModel = watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video';

  // Set Tyler as default when switching to flux-lora model
  React.useEffect(() => {
    if (isFluxLoraModel && (!form.getValues('selectedLora') || form.getValues('selectedLora') === 'none')) {
      form.setValue('selectedLora', 'tyler');
    } else if (!isFluxLoraModel) {
      form.setValue('selectedLora', 'none');
    }
  }, [isFluxLoraModel, form]);

  // Set defaults for style transfer model
  React.useEffect(() => {
    if (isStyleTransferModel) {
      // Set defaults for style transfer
      if (!form.getValues('safety_tolerance')) {
        form.setValue('safety_tolerance', '2');
      }
      if (!form.getValues('output_format')) {
        form.setValue('output_format', 'jpeg');
      }
      // Clear image URL when switching away from style transfer
    } else if (form.getValues('image_url')) {
      form.setValue('image_url', '');
    }
  }, [isStyleTransferModel, form]);

  // Set defaults for video generation model
  React.useEffect(() => {
    if (isVideoGenerationModel) {
      // Set defaults for video generation
      if (!form.getValues('aspect_ratio')) {
        form.setValue('aspect_ratio', '16:9');
      }
      if (!form.getValues('duration')) {
        form.setValue('duration', '8s');
      }
      if (form.getValues('enhance_prompt') === undefined) {
        form.setValue('enhance_prompt', true);
      }
      if (form.getValues('generate_audio') === undefined) {
        form.setValue('generate_audio', true);
      }
    }
  }, [isVideoGenerationModel, form]);

  // Set defaults for fashion photoshoot model
  React.useEffect(() => {
    if (isFashionPhotoshootModel) {
      // Set defaults for fashion photoshoot
      if (!form.getValues('gender')) {
        form.setValue('gender', 'male');
      }
      if (!form.getValues('body_size')) {
        form.setValue('body_size', 'M');
      }
      if (!form.getValues('location')) {
        form.setValue('location', 'park');
      }
    }
  }, [isFashionPhotoshootModel, form]);

  // Set defaults for image-to-video model
  React.useEffect(() => {
    if (isImageToVideoModel) {
      // Set defaults for image-to-video
      if (!form.getValues('resolution')) {
        form.setValue('resolution', '720p');
      }
      if (!form.getValues('video_length')) {
        form.setValue('video_length', '5');
      }
    }
  }, [isImageToVideoModel, form]);

  return (
    <ClientOnlyWrapper>
      <form className="space-y-6 " onSubmit={form.handleSubmit(submit)}>
        <FieldModelId />
        {isFluxLoraModel && <FieldLora />}
        {isStyleTransferModel && <FieldImageUpload />}
        {isImageToVideoModel && <FieldImageUpload />}
        {isVideoGenerationModel && (
          <>
            <FieldAspectRatio />
            <FieldDuration />
          </>
        )}
        {isImageToVideoModel && (
          <>
            <FieldResolution />
            <FieldVideoDuration />
          </>
        )}
        {isFashionPhotoshootModel && (
          <>
            <FieldGarmentImage />
            <FieldFaceImage />
            <FieldGender />
            <FieldBodySize />
            <FieldLocation />
          </>
        )}
        <FieldPrompt />
        {isVideoGenerationModel && (
          <>
            <FieldEnhancePrompt />
            <FieldGenerateAudio />
          </>
        )}
        {!isStyleTransferModel && !isVideoGenerationModel && !isFashionPhotoshootModel && !isImageToVideoModel && <FieldImageSize />}
        {!isVideoGenerationModel && !isFashionPhotoshootModel && !isImageToVideoModel && <FieldNumberOfImages />}
        <FieldSeed />

        <div className="pt-4 ">
          <Button
            disabled={isPending}
            type="submit"
            className="unusual-button lg:w-4/5 w-3/4 mx-auto justify-center flex"
          >
            {isPending ? 'Generating...' : 'Generate'}
          </Button>
        </div>
      </form>
    </ClientOnlyWrapper>
  );
};

// Results component for the main content area
export const PlaygroundResults = () => {
  const { isPending } = useMutationGenerateImages();
  const { data } = useQueryGeneratedImages();
  const hasNoData = !isPending && !data?.length;

  return (
    <ClientOnlyWrapper>
      <div className="space-y-12">
        {/* Images Grid */}
        <div className="space-y-8">
          {/* Image count display when there are images */}
          {data && data.length > 0 && (
            <div className="text-right">
              <div className="text-sm text-muted-foreground font-mono">
                {data.length} image{data.length !== 1 ? 's' : ''} generated
              </div>
            </div>
          )}

          {hasNoData && (
            <div className="flex flex-col items-center justify-center py-14 text-center mx-auto ">
              <div className="max-w-lg space-y-2 ">
                <div className="space-y-0">


                  <div className="w-40 h-40 pt-1 pb-1 flex rounded-xl mx-auto  items-center justify-center">

                  </div>
                  <h3 className=" font-light text-3xl tracking-tight text-orange-200 pb-4 ">Image Will Show Here</h3>
                  <p className="text-orange-200 text-sm w-4/5 mx-auto border-pink-300/30 border-2 bg-gradient-to-br from-pink-400/20 to-orange-200/20 rounded-full py-2 px-2">
                    Use menu to generate images. Images saved in Library.
                  </p>

                </div>

              </div>
            </div>
          )}

          {(isPending || (data && data.length > 0)) && (
            <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <SkeletonList isPending={isPending} />
              {!isPending && (data || []).map((x, index) => (
                <div
                  key={x.url}
                  className="group relative bg-card border border-border hover:border-accent transition-all duration-300 rounded-lg overflow-hidden"
                >
                  <div className="aspect-square overflow-hidden">
                    <MediaDialog {...x} />
                  </div>
                  <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm px-2 py-1 text-xs font-mono border border-border rounded">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ClientOnlyWrapper>
  );
};

// Main playground component (kept for compatibility)
export default function Playground() {
  return <PlaygroundResults />;
}
