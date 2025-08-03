import React from 'react';
import { useFormContext } from 'react-hook-form';
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormType } from '../types/form.type';

const SAFETY_TOLERANCE_OPTIONS = [
  { value: '1', label: 'Level 1 (Most Restrictive)' },
  { value: '2', label: 'Level 2 (Default)' },
  { value: '3', label: 'Level 3' },
  { value: '4', label: 'Level 4' },
  { value: '5', label: 'Level 5 (Least Restrictive)' },
] as const;

export const FieldSafetyTolerance = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="safety_tolerance"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="px-4 text-muted-foreground font-newake text-base">Safety Tolerance</FormLabel>
          <FormControl>
            <Select
              disabled={form.formState.isSubmitting}
              value={field.value || '2'}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full bg-black/20 bg-blur-xl rounded-full px-4 py-1.5 text-sm outline-none focus:bg-red-300/20 data-[state=open]:bg-accent/70">
                <SelectValue placeholder="Select safety level" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Safety Levels</SelectLabel>
                  {SAFETY_TOLERANCE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
          <FormDescription className="px-4 text-xs text-muted-foreground">
            Controls content safety filtering. Level 2 is recommended for most use cases.
          </FormDescription>
        </FormItem>
      )}
    />
  );
};