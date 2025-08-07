'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormType } from '@/modules/playground/types/form.type';
import {
    FormField,
    FormItem,
    FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/image-upload';

export const FieldImageUpload = () => {
    const form = useFormContext<FormType>();
    const watchedModelId = form.watch('modelId');

    const getLabel = () => {
        if (watchedModelId === 'fal-ai/image-editing/style-transfer') {
            return 'Source Image (Required)';
        }
        if (watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
            return 'Input Image (Required)';
        }
        if (watchedModelId === 'fal-ai/veo3/image-to-video') {
            return 'Input Image (Required)';
        }
        if (watchedModelId === 'fal-ai/ideogram/character') {
            return 'Reference Image (Required)';
        }
        return 'Image';
    };

    const getDescription = () => {
        if (watchedModelId === 'fal-ai/image-editing/style-transfer') {
            return 'Upload or provide URL for the image you want to apply style transfer to';
        }
        if (watchedModelId === 'fal-ai/kling-video/v2.1/standard/image-to-video') {
            return 'Upload or provide URL for the image you want to animate into a video';
        }
        if (watchedModelId === 'fal-ai/veo3/image-to-video') {
            return 'Upload or provide URL for the image you want to animate with Veo3';
        }
        if (watchedModelId === 'fal-ai/ideogram/character') {
            return 'Upload or provide URL for the character reference image (required)';
        }
        return 'Upload or provide URL for the image you want to process';
    };

    return (
        <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
                <FormItem>
                    <ImageUpload
                        name="image_url"
                        label={getLabel()}
                        description={getDescription()}
                        modelId={watchedModelId}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 