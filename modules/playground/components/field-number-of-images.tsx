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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export const FieldNumberOfImages = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="num_images"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Number of images</FormLabel>
          <FormControl>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Slider
                disabled={form.formState.isSubmitting}
                value={[Number(field.value) || 1]}
                max={4}
                min={1}
                step={1}
                onValueChange={(value) => {
                  field.onChange(value[0]);
                  field.onBlur();
                }}
                className={cn('w-full flex-1')}
              />
              <Input
                disabled={form.formState.isSubmitting}
                {...field}
                onChange={(event) => field.onChange(Number(event.target.value))}
                type="number"
                className="w-full sm:w-20"
                max={4}
                min={1}
                step={1}
              />
            </div>
          </FormControl>
          <FormMessage />
          <FormDescription></FormDescription>
        </FormItem>
      )}
    />
  );
};
