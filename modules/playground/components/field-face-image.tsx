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

export const FieldFaceImage = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="face_image"
            render={({ field }) => (
                <FormItem>
                    <ImageUpload
                        value={field.value || ''}
                        onChange={field.onChange}
                        label="Face Image"
                        description="Upload or provide URL for the face/model image for the fashion photoshoot"
                        className="object-contain overflow-hidden lg:w-[420px] w-[330px]"
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 