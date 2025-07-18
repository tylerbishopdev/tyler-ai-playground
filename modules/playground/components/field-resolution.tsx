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

const RESOLUTION_OPTIONS = [
    { value: '720p', label: '720p (HD)' },
    { value: '1080p', label: '1080p (Full HD)' },
] as const;

export const FieldResolution = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="resolution"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Video Resolution</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || '720p'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select resolution" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {RESOLUTION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Choose the output video resolution
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 