import { ImageType, VideoType, MediaType } from './imageType';

export type OutputType = {
  seed: number;
  images: ImageType[];
  prompt: string;
  timings: {
    inference: number;
  };
  has_nsfw_concepts: [boolean];
};

export type VideoOutputType = {
  video: VideoType;
  prompt: string;
  timings: {
    inference: number;
  };
  has_nsfw_concepts?: boolean;
};

export type MediaOutputType = OutputType | VideoOutputType;
