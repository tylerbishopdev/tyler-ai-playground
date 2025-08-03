'use client';

import { Button } from '@/components/ui/button';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { useMutationGenerateImages } from '@/modules/playground/hooks/use-mutation-generate-images';
import { FormType } from '@/modules/playground/types/form.type';
import { FieldPrompt } from '@/modules/playground/components/field-prompt';
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
import { FieldVeo3Duration } from '@/modules/playground/components/field-veo3-duration';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { FormGeneratorProvider } from '@/modules/form-provider/form-generator-provider';
import {
    Rocket,
    Settings2,
    RatioIcon as AspectRatio,
    Palette,
    Bot,
    Upload,
    ChevronsUpDown,
    Type,
    ChevronDown,
    Wand2,
    Shirt,
    MessageSquare,
    Link as LinkIcon,
} from 'lucide-react';

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

// Dock Item Component
function DockItem({
    icon,
    label,
    children,
    isEnabled = true
}: {
    icon: React.ReactNode;
    label: string;
    children: React.ReactNode;
    isEnabled?: boolean;
}) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div>
                    <Popover open={isOpen} onOpenChange={setIsOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                disabled={!isEnabled}
                                className={cn(
                                    "h-12 w-12  rounded-full hover:bg-black/50 hover:text-pink-300 disabled:bg-transparent disabled:cursor-not-allowed group transition-colors flex-shrink-0",
                                    isOpen ? "bg-black/70 text-pink-300" : "text-red-200 hover:text-pink-200",
                                    "disabled:text-neutral-300/30",
                                )}
                            >
                                {icon}
                            </Button>
                        </PopoverTrigger>
                        {isEnabled && (
                            <PopoverContent
                                side="top"
                                align="center"
                                className="w-[90vw] md:max-w-4xl bg-black/20 border-zinc-100/10 rounded-xl text-red-100 shadow-red-300/20 backdrop-blur-lg mb-2"
                                onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <h4 className="font-medium leading-none">{label}</h4>
                                        <p className="text-sm text-gray-400">Adjust the {label.toLowerCase()} settings.</p>
                                    </div>
                                    <div className="max-h-[60vh] overflow-y-auto">
                                        {children}
                                    </div>
                                </div>
                            </PopoverContent>
                        )}
                    </Popover>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-black/50 border-border text-primary">
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    );
}

// Form component adapted for dock layout
function DockForm({ setIsPending }: { setIsPending: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { mutateAsync, isPending } = useMutationGenerateImages();
    const form = useFormContext<FormType>();

    // Update parent's isPending state whenever local isPending changes
    React.useEffect(() => {
        setIsPending(isPending);
    }, [isPending, setIsPending]);

    const submit = async (body: FormType) => {
        // Validate required fields based on model
        if (body.modelId === 'fal-ai/image-editing/style-transfer') {
            if (!body.image_url || !body.image_url.trim()) {
                form.setError('image_url', {
                    type: 'manual',
                    message: 'Please upload or provide an image URL for style transfer',
                });
                return;
            }
        }

        if (body.modelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
            if (!body.image_url || !body.image_url.trim()) {
                form.setError('image_url', {
                    type: 'manual',
                    message: 'Please upload or provide an image URL to animate',
                });
                return;
            }
        }

        if (body.modelId === 'fal-ai/veo3/image-to-video') {
            if (!body.image_url || !body.image_url.trim()) {
                form.setError('image_url', {
                    type: 'manual',
                    message: 'Please upload or provide an image URL to animate with Veo3',
                });
                return;
            }
        }

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
            case 'fal-ai/veo3/image-to-video':
                // Veo3 image-to-video doesn't use inference steps or guidance scale
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
        }
        // Style transfer specific fields
        else if (body.modelId === 'fal-ai/image-editing/style-transfer') {
            // image_url is required for this model - validation happens above
            data.set('image_url', body.image_url || '');
            data.set('safety_tolerance', body.safety_tolerance || '2');
            data.set('output_format', body.output_format || 'jpeg');
        }
        // Fashion photoshoot specific fields
        else if (body.modelId === 'easel-ai/fashion-photoshoot') {
            if (body.garment_image && body.garment_image.trim()) {
                data.set('garment_image', body.garment_image);
            }
            if (body.face_image && body.face_image.trim()) {
                data.set('face_image', body.face_image);
            }
            data.set('gender', body.gender || 'male');
            data.set('body_size', body.body_size || 'M');
            data.set('location', body.location || 'park');
        }
        // Image-to-video specific fields
        else if (body.modelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
            if (!body.image_url || !body.image_url.trim()) {
                form.setError('image_url', {
                    type: 'manual',
                    message: 'Image URL is required for Kling video model',
                });
                return;
            }
            data.set('image_url', body.image_url);
            data.set('duration', body.video_length || '5');
        } else if (body.modelId === 'fal-ai/veo3/image-to-video') {
            if (!body.image_url || !body.image_url.trim()) {
                form.setError('image_url', {
                    type: 'manual',
                    message: 'Image URL is required for Veo3 image-to-video model',
                });
                return;
            }
            data.set('image_url', body.image_url);
            data.set('duration', body.veo3_duration || '8s');
            data.set('generate_audio', String(body.generate_audio ?? true));
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
            data.set('loras', JSON.stringify([]));
        }

        await mutateAsync(data);
    };

    const watchedModelId = form.watch('modelId');
    const isFluxLoraModel = watchedModelId === 'fal-ai/flux-lora';
    const isStyleTransferModel = watchedModelId === 'fal-ai/image-editing/style-transfer';
    const isVideoGenerationModel = watchedModelId === 'fal-ai/veo3/fast';
    const isFashionPhotoshootModel = watchedModelId === 'easel-ai/fashion-photoshoot';
    const isImageToVideoModel = watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video' || watchedModelId === 'fal-ai/veo3/image-to-video';

    // Set defaults when model changes
    React.useEffect(() => {
        if (isFluxLoraModel && (!form.getValues('selectedLora') || form.getValues('selectedLora') === 'none')) {
            form.setValue('selectedLora', 'tyler');
        } else if (!isFluxLoraModel) {
            form.setValue('selectedLora', 'none');
        }
    }, [isFluxLoraModel, form]);

    React.useEffect(() => {
        if (isStyleTransferModel) {
            if (!form.getValues('safety_tolerance')) {
                form.setValue('safety_tolerance', '2');
            }
            if (!form.getValues('output_format')) {
                form.setValue('output_format', 'jpeg');
            }
        }
    }, [isStyleTransferModel, form]);

    React.useEffect(() => {
        if (isVideoGenerationModel) {
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

    React.useEffect(() => {
        if (isFashionPhotoshootModel) {
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

    React.useEffect(() => {
        if (isImageToVideoModel) {
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
            <form onSubmit={form.handleSubmit(submit)} className="hidden">
                {/* Hidden form to maintain all existing functionality */}
                <FieldModelId />
                {isFluxLoraModel && <FieldLora />}
                {/* Image upload fields are rendered in DockItem, not here to avoid duplication */}
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
                        {/* Garment and Face image fields are rendered in DockItem */}
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
                <button type="submit" className="hidden">Submit</button>
            </form>
        </ClientOnlyWrapper>
    );
}

// Results component for the main content area
function DockResults() {
    const { isPending } = useMutationGenerateImages();
    const { data } = useQueryGeneratedImages();
    const hasNoData = !isPending && !data?.length;

    return (
        <ClientOnlyWrapper>
            <div className="space-y-8 h-full align-middle md:space-y-2 w-full mx-auto">
                <div className="space-y-4 md:space-y-4 mx-auto">
                    {data && data.length > 0 && (
                        <div className="text-right px-4">
                            <div className="text-sm text-muted-foreground font-mono">
                                {data.length} image{data.length !== 1 ? 's' : ''} generated
                            </div>
                        </div>
                    )}

                    {hasNoData && (
                        <div className="flex flex-col items-center justify-center min-h-[60vh] pb-2 text-center mx-auto px-4 border-4 border-border/20 rounded-xl ">
                            <div className="max-w-lg space-y-4">
                                <div className="space-y-2">
                                    <h3 className="text-2xl text-primary/50 font-bold ">Image Will Show Here</h3>

                                </div>
                            </div>
                        </div>
                    )}

                    {(isPending || (data && data.length > 0)) && (
                        <div className="grid gap-2 md:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-4">
                            <SkeletonList isPending={isPending} />
                            {!isPending && (data || []).map((x, index) => (
                                <div
                                    key={x.url}
                                    className="group relative bg-card border border-border hover:border-accent transition-all duration-300 rounded-xl overflow-hidden"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <MediaDialog {...x} />
                                    </div>
                                    <div className="absolute top-1 left-1 md:top-2 md:left-2 bg-background/90 backdrop-blur-sm px-1 py-0.5 md:px-2 md:py-1 text-xs font-mono border border-border rounded-xl">
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
}

// Main dock layout component
function DockLayoutContent({ isPending }: { isPending: boolean }) {
    const form = useFormContext<FormType>();

    const handleGenerate = async () => {
        // Find and click the hidden submit button
        const hiddenSubmitButton = document.querySelector('form.hidden button[type="submit"]') as HTMLButtonElement;
        if (hiddenSubmitButton) {
            hiddenSubmitButton.click();
        }
    };

    const watchedModelId = form.watch('modelId');

    return (
        <TooltipProvider>
            <div className="relative h-screen w-full   text-primary font-sans overflow-hidden">
                <header className="flex justify-between items-center mx-auto z-10 p-0 mt-2 w-full  ">
                    <div className="flex items-center justify-between w-full">
                        {/* Logo - clickable to home */}


                        {/* Navigation Menu */}
                        <nav className="flex flex-col items-center gap-2 p-1 mx-auto">
                            {/* Logo centered above links */}
                            <div className="flex justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Tyler AI Playground Logo"
                                    width={320}
                                    height={160}
                                    className="w-60 "
                                />

                            </div>

                            {/* Links row */}
                            <div className="flex items-center gap-2">
                                <Link href="/" className="px-4 py-1 text-primary/70 hover:text-primary rounded-full transition-all duration-200 text-xl font-bold font-newake tracking-wide">
                                    Home
                                </Link>
                                <Link
                                    href="/local-gallery"
                                    className="px-4 py-1 text-primary/70 hover:text-primary rounded-full transition-all duration-200 text-xl font-bold font-newake tracking-wide"
                                >
                                    Your Images
                                </Link>
                            </div>
                        </nav>
                    </div>
                </header>

                <main className="flex-1 flex flex-col items-center justify-center p-2 relative mx-auto">
                    <div className="w-full max-w-4xl h-auto flex items-center justify-center">
                        {isPending ? (
                            <div className="fixed inset-0 flex items-center justify-center z-40">
                                <div className="pyramid-loader">
                                    <div className="wrapper">
                                        <span className="side side1"></span>
                                        <span className="side side2"></span>
                                        <span className="side side3"></span>
                                        <span className="side side4"></span>
                                        <span className="shadow"></span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <DockResults />
                        )}
                    </div>
                </main>

                {/* Mobile dock with model button */}
                <footer className="w-full p-4 fixed bottom-0 left-0 right-0 z-50">
                    <div className="flex justify-center items-center gap-2">
                        {/* Model button - custom larger size */}
                        <div className="relative flex-shrink-0">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="p-2">
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    className="h-14 w-14 rounded-full bg-secondary/30 hover:bg-primary/50 hover:text-primary text-primary transition-colors flex-shrink-0"
                                                >
                                                    <Bot size={40} className="w-8 h-8" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                side="top"
                                                align="center"
                                                className="w-auto p-3 bg-black/20 border-zinc-100/10 rounded-xl text-red-100 shadow-red-300/20 backdrop-blur-lg mb-2"
                                                onOpenAutoFocus={(e) => e.preventDefault()}
                                            >
                                                <div className="space-y-2">
                                                    <div>
                                                        <h4 className="font-medium leading-none text-sm">Model</h4>
                                                        <p className="text-xs text-gray-400">Select your model</p>
                                                    </div>
                                                    <div className="w-full">
                                                        <FieldModelId />
                                                    </div>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-black/50 border-border text-primary rounded-xl">
                                    <p>Model</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>

                        {/* The main dock */}
                        <div className="flex items-center gap-0.5 md:gap-1 bg-gradient-to-tr from-primary/20 via-accent/10 to-secondary/20 border border-secondary/10 rounded-full p-0.5 md:p-1 backdrop-blur-md max-w-[85vw] md:max-w-[90vw] overflow-x-auto scrollbar-hide">
                            <DockItem
                                icon={<Type size={22} className="md:size-7" />}
                                label="Prompt"
                                isEnabled={true}
                            >
                                <FieldPrompt />
                            </DockItem>

                            <DockItem
                                icon={<Upload size={22} className="md:size-7" />}
                                label="Uploads"
                                isEnabled={watchedModelId === 'fal-ai/image-editing/style-transfer' || watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video' || watchedModelId === 'easel-ai/fashion-photoshoot' || watchedModelId === 'fal-ai/veo3/image-to-video'}
                            >
                                <div className="space-y-4">
                                    {watchedModelId === 'fal-ai/image-editing/style-transfer' && <FieldImageUpload />}
                                    {watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video' && <FieldImageUpload />}
                                    {watchedModelId === 'fal-ai/veo3/image-to-video' && <FieldImageUpload />}
                                    {watchedModelId === 'easel-ai/fashion-photoshoot' && (
                                        <>
                                            <FieldGarmentImage />
                                            <FieldFaceImage />
                                        </>
                                    )}
                                </div>
                            </DockItem>

                            <DockItem
                                icon={<Palette size={22} className="md:size-7" />}
                                label="Parameters"
                                isEnabled={watchedModelId === 'easel-ai/fashion-photoshoot'}
                            >
                                <div className="space-y-4">
                                    {watchedModelId === 'easel-ai/fashion-photoshoot' && (
                                        <>
                                            <FieldGender />
                                            <FieldBodySize />
                                            <FieldLocation />
                                        </>
                                    )}
                                </div>
                            </DockItem>

                            <DockItem
                                icon={<AspectRatio size={22} className="md:size-7" />}
                                label="Format"
                                isEnabled={!['fal-ai/image-editing/style-transfer', 'fal-ai/veo3/fast', 'easel-ai/fashion-photoshoot', 'fal-ai/kling-video/v2.1/standard/image-to-video', 'fal-ai/veo3/image-to-video'].includes(watchedModelId)}
                            >
                                <div className="space-y-4">
                                    <FieldImageSize />
                                    <FieldNumberOfImages />
                                </div>
                            </DockItem>

                            <DockItem
                                icon={<Settings2 size={22} className="md:size-7" />}
                                label="Advanced"
                                isEnabled={true}
                            >
                                <div className="space-y-4">
                                    <FieldSeed />
                                    {isFluxLoraModel && <FieldLora />}
                                    {watchedModelId === 'fal-ai/veo3/fast' && (
                                        <>
                                            <FieldAspectRatio />
                                            <FieldDuration />
                                            <FieldEnhancePrompt />
                                            <FieldGenerateAudio />
                                        </>
                                    )}
                                    {watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video' && (
                                        <>
                                            <FieldResolution />
                                            <FieldVideoDuration />
                                        </>
                                    )}
                                    {watchedModelId === 'fal-ai/veo3/image-to-video' && (
                                        <>
                                            <FieldVeo3Duration />
                                            <FieldGenerateAudio />
                                        </>
                                    )}
                                </div>
                            </DockItem>


                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleGenerate}
                                        disabled={isPending || !watchedModelId}
                                        className="bg-primary hover:bg-primary/50 text-zinc-950 rounded-full h-12 w-12 md:h-16 md:w-16 flex items-center justify-center disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed flex-shrink-0 hover:text-primary"
                                    >
                                        <Rocket size={22} className="md:w-6 md:h-6" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-zinc-800 rounded-xl border-zinc-200 text-primary">
                                    <p>Generate</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </footer>
            </div>
        </TooltipProvider>
    );
}

// Main page component with form provider
export default function DockLayoutPage() {
    const [isPending, setIsPending] = React.useState(false);

    return (
        <FormGeneratorProvider>
            <DockLayoutContent isPending={isPending} />
            <DockForm setIsPending={setIsPending} />
        </FormGeneratorProvider>
    );
} 