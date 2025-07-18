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

const DURATION_OPTIONS = [
    { value: '4s', label: '4 seconds' },
    { value: '8s', label: '8 seconds' },
    { value: '16s', label: '16 seconds' },
] as const;

export const FieldDuration = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || '8s'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {DURATION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Choose how long your video should be
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 