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
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon } from 'lucide-react';

function generateRandomNumber(digits: number) {
  let min = Math.pow(10, digits - 1);
  let max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const FieldSeed = () => {
  const form = useFormContext<FormType>();

  return (
    <FormField
      control={form.control}
      name="seed"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Seed</FormLabel>
          <FormControl>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <Input
                id="prompt"
                placeholder="Random number"
                className="w-full flex-1"
                {...field}
                disabled={form.formState.isSubmitting}
              />
              <Button
                disabled={form.formState.isSubmitting}
                type="button"
                variant="outline"
                size="sm"
                className="w-full sm:w-auto px-3"
                onClick={() => {
                  field.onChange(generateRandomNumber(7));
                }}
              >
                <RefreshCcwIcon className="h-4 w-4" />
                <span className="ml-2 sm:hidden">Random</span>
              </Button>
            </div>
          </FormControl>
          <FormMessage />
          <FormDescription></FormDescription>
        </FormItem>
      )}
    />
  );
};
