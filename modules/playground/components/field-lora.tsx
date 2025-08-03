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

// Predefined LoRA models
export const LORA_MODELS = [
    {
        id: 'tyler',
        name: 'Tyler',
        path: 'https://storage.googleapis.com/fal-flux-lora/8c49e26b261f4acca85012dd05016d15_pytorch_lora_weights.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'jena',
        name: 'Jena',
        path: 'https://storage.googleapis.com/fal-flux-lora/46b8cf8ac8c44837aa1c115e6ec5e68a_lora.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'angela',
        name: 'Angela',
        path: 'https://storage.googleapis.com/fal-flux-lora/2591dc5eaff047ec94a22a28ee6d33cc_lora.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'brian',
        name: 'Brian',
        path: 'https://storage.googleapis.com/fal-flux-lora/9a1dc5bfbfbe39b43_lora.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'adam',
        name: 'Adam',
        path: 'https://storage.googleapis.com/fal-flux-lora/c0cf6942a5bd43d4999c0dd7f04affaa_lora.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'teddy',
        name: 'Teddy',
        path: 'https://storage.googleapis.com/fal-flux-lora/7c2b71eb8768432dbb5867ebce5cfa28_pytorch_lora_weights.safetensors',
        weight: 1,
        scale: 1
    },
    {
        id: 'arnold',
        name: 'Arnold',
        path: 'https://storage.googleapis.com/fal-flux-lora/eb7136c32e82473e89069339ee78d99c_pytorch_lora_weights.safetensors',
        weight: 1,
        scale: 1
    }
] as const;

export const FieldLora = () => {
    const form = useFormContext<FormType>();

    return (
        <FormField
            control={form.control}
            name="selectedLora"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>LoRA Model</FormLabel>
                    <FormControl>
                        <Select
                            disabled={form.formState.isSubmitting}
                            value={field.value || 'none'}
                            onValueChange={(value) => {
                                field.onChange(value);
                            }}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a LoRA model (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>LoRA Models</SelectLabel>
                                    <SelectItem value="none">None</SelectItem>
                                    {LORA_MODELS.map((lora) => (
                                        <SelectItem key={lora.id} value={lora.id}>
                                            {lora.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                        Select a LoRA model to apply custom styles. Only available for flux-lora model.
                    </FormDescription>
                </FormItem>
            )}
        />
    );
}; 