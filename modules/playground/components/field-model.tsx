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
import { MODELS_TEXT_TO_IMAGE } from '../types/model-text-to-image.type';

export const FieldModelId = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="modelId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="ml-4"></FormLabel>
          <FormControl>
            <Select
              disabled={form.formState.isSubmitting}
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
              }}
            >
              <SelectTrigger className="w-full bg-black/20 bg-blur-xl border-zinc-500/50 border-2 rounded-full px-4 py-1.5 text-sm outline-none focus:bg-cyan-300/20 data-[state=open]:bg-accent/70">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Models</SelectLabel>
                  {MODELS_TEXT_TO_IMAGE.map((x) => (
                    <SelectItem key={x.id} value={x.id}>
                      {x.id}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
          <FormDescription></FormDescription>
        </FormItem>
      )}
    />
  );
};
