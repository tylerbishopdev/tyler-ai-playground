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
import { ImageDialog } from '@/components/image-dialog';
import { FieldSeed } from '@/modules/playground/components/field-seed';
import { FieldImageSize } from '@/modules/playground/components/field-image-size';
import { useQueryGeneratedImages } from '@/modules/playground/hooks/use-query-generated-images';
import { SkeletonList } from '@/modules/playground/components/skeleton-list';
import { FieldLora, LORA_MODELS } from '@/modules/playground/components/field-lora';
import { FieldImageUpload } from '@/modules/playground/components/field-image-upload';

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
      case 'fal-ai/flux-pro':
        inferenceSteps = 25;
        guidanceScale = 3.5;
        break;
      case 'fal-ai/ideogram/v3':
        inferenceSteps = 30;
        guidanceScale = 7.5;
        break;
      case 'fal-ai/luma-photon':
        inferenceSteps = 20;
        guidanceScale = 3.0;
        break;
      case 'fal-ai/imagen4/preview/fast':
        inferenceSteps = 20;
        guidanceScale = 2.5;
        break;
      case 'fal-ai/recraft/v3/text-to-image':
        inferenceSteps = 25;
        guidanceScale = 4.0;
        break;
      case 'fal-ai/image-editing/style-transfer':
        inferenceSteps = 30;
        guidanceScale = 3.5;
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

    // Style transfer specific fields
    if (body.modelId === 'fal-ai/image-editing/style-transfer') {
      data.set('image_url', body.image_url || '');
      data.set('safety_tolerance', body.safety_tolerance || '2');
      data.set('output_format', body.output_format || 'jpeg');
      // Don't set image size fields for style transfer
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

  return (
    <form className="space-y-6 " onSubmit={form.handleSubmit(submit)}>
      <FieldModelId />
      {isFluxLoraModel && <FieldLora />}
      {isStyleTransferModel && <FieldImageUpload />}
      <FieldPrompt />
      {!isStyleTransferModel && <FieldImageSize />}
      <FieldNumberOfImages />
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
  );
};

// Results component for the main content area
export const PlaygroundResults = () => {
  const { isPending } = useMutationGenerateImages();
  const { data } = useQueryGeneratedImages();
  const hasNoData = !isPending && !data?.length;

  return (
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
                  <Image src="/tplace.png" alt="Placeholder" width={288} height={228} className="rounded-xl shadow-pink-300/30 shadow-xl opacity-80" />
                </div>
                <h3 className=" font-light text-3xl tracking-tight text-pink-300 pb-4 ">Image Will Show Here</h3>
                <p className="text-muted-foreground text-sm w-3/4 mx-auto border-pink-300/30 border rounded-full py-2 px-1">
                  Use menu to generate images. Save images or view previous ones stored in your in your library.
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
                  <ImageDialog {...x} />
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
  );
};

// Main playground component (kept for compatibility)
export default function Playground() {
  return <PlaygroundResults />;
}
