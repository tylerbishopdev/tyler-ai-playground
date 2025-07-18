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

const ASPECT_RATIO_OPTIONS = [
    { value: '16:9', label: '16:9 (Landscape)' },
    { value: '9:16', label: '9:16 (Portrait)' },
    { value: '1:1', label: '1:1 (Square)' },
    { value: '4:3', label: '4:3 (Classic)' },
    { value: '3:4', label: '3:4 (Classic Portrait)' },
] as const;

export const FieldAspectRatio = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="aspect_ratio"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Aspect Ratio</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || '16:9'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select aspect ratio" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {ASPECT_RATIO_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Choose the aspect ratio for your video
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 