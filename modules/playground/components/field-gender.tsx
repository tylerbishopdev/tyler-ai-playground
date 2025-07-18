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

const GENDER_OPTIONS = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
] as const;

export const FieldGender = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'male'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Select the gender for the fashion photoshoot model
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 