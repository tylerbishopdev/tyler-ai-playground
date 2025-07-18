'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormType } from '@/modules/playground/types/form.type';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';

export const FieldGenerateAudio = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="generate_audio"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <FormLabel className="text-base">
                            Generate Audio
                        </FormLabel>
                        <FormDescription>
                            Generate synchronized audio for your video
                        </FormDescription>
                    </div>
                    <FormControl>
                        <Switch
                            checked={field.value ?? true}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 