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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const VIDEO_DURATION_OPTIONS = [
    { value: '3', label: '3 seconds' },
    { value: '5', label: '5 seconds' },
    { value: '10', label: '10 seconds' },
] as const;

export const FieldVideoDuration = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="video_length"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Video Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || '5'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {VIDEO_DURATION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Choose how long the generated video should be
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 