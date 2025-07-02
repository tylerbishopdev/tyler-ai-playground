'use client';

import { Button } from '@/components/ui/button';
import * as React from 'react';
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
      case 'fal-ai/flux/schnell':
        inferenceSteps = 4;
        guidanceScale = 1.0;
        break;
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
      case 'fal-ai/dreamo':
        inferenceSteps = 25;
        guidanceScale = 5.0;
        break;
      case 'fal-ai/imagen4/preview/fast':
        inferenceSteps = 20;
        guidanceScale = 2.5;
        break;
      case 'fal-ai/imagen4/preview/ultra':
        inferenceSteps = 40;
        guidanceScale = 3.0;
        break;
      case 'fal-ai/recraft/v3/text-to-image':
        inferenceSteps = 25;
        guidanceScale = 4.0;
        break;
      case 'fal-ai/playground-v25':
        inferenceSteps = 30;
        guidanceScale = 6.0;
        break;
      case 'fal-ai/realistic-vision':
        inferenceSteps = 25;
        guidanceScale = 7.0;
        break;
      default: // fal-ai/flux/dev and fal-ai/flux-lora
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

    data.set('image_size', body.image_size);
    data.set('image_sizes_width', String(body.image_sizes?.width || 200));
    data.set('image_sizes_height', String(body.image_sizes?.height || 200));

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

  // Set Tyler as default when switching to flux-lora model
  React.useEffect(() => {
    if (isFluxLoraModel && (!form.getValues('selectedLora') || form.getValues('selectedLora') === 'none')) {
      form.setValue('selectedLora', 'tyler');
    } else if (!isFluxLoraModel) {
      form.setValue('selectedLora', 'none');
    }
  }, [isFluxLoraModel, form]);

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <FieldModelId />
      {isFluxLoraModel && <FieldLora />}
      <FieldPrompt />
      <FieldImageSize />
      <FieldNumberOfImages />
      <FieldSeed />

      <div className="pt-4 border-t border-border">
        <Button
          disabled={isPending}
          type="submit"
          className="unusual-button w-full"
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
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="max-w-md space-y-6">
              <div className="space-y-2">
                <h3>No Images Yet</h3>
                <p className="text-muted-foreground">
                  Use the menu to generate images here. Past images are saved in the browser and accessable to in your gallery.
                </p>
              </div>
              <div className="w-32 h-32 mx-auto border border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-4xl text-muted-foreground">+</div>
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
