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

const BODY_SIZE_OPTIONS = [
    { value: 'XS', label: 'Extra Small (XS)' },
    { value: 'S', label: 'Small (S)' },
    { value: 'M', label: 'Medium (M)' },
    { value: 'L', label: 'Large (L)' },
    { value: 'XL', label: 'Extra Large (XL)' },
    { value: 'XXL', label: 'Extra Extra Large (XXL)' },
] as const;

export const FieldBodySize = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="body_size"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Body Size</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'M'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select body size" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {BODY_SIZE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Select the body size for the fashion photoshoot
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 