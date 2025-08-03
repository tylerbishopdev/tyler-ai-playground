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

const VEO3_DURATION_OPTIONS = [
    { value: '8s', label: '8 seconds (only option)' },
] as const;

export const FieldVeo3Duration = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="veo3_duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || '8s'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="8 seconds" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {VEO3_DURATION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Veo3 image-to-video only supports 8-second duration
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};