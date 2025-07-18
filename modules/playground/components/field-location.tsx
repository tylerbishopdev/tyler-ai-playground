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

export const FieldLocation = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value || 'park'}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="park">Park</SelectItem>
                            <SelectItem value="city">City</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormDescription>
                        Choose the location setting for the fashion photoshoot
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 