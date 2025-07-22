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

const OUTPUT_FORMAT_OPTIONS = [
  { value: 'jpeg', label: 'JPEG (Recommended)' },
  { value: 'png', label: 'PNG (Transparency Support)' },
] as const;

export const FieldOutputFormat = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="output_format"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="px-4 text-muted-foreground font-newake text-base">Output Format</FormLabel>
          <FormControl>
            <Select
              disabled={form.formState.isSubmitting}
              value={field.value || 'jpeg'}
              onValueChange={field.onChange}
            >
              <SelectTrigger className="w-full bg-black/20 bg-blur-xl rounded-full px-4 py-1.5 text-sm outline-none focus:bg-cyan-300/20 data-[state=open]:bg-accent/70">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Image Formats</SelectLabel>
                  {OUTPUT_FORMAT_OPTIONS.map((option) => (
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
            Choose the output image format. JPEG is smaller, PNG supports transparency.
          </FormDescription>
        </FormItem>
      )}
    />
  );
};