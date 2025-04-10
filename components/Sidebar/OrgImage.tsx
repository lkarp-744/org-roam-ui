import React from 'react';
import { Container } from '@chakra-ui/react';

export interface OrgImageProps {
  src: string;
  file: string;
}

const join = (dir: string, name: string) => {
  return `${dir}/${name}`;
};

const dirname = (path: string) => {
  const lastSeparatorIndex = path.lastIndexOf('/');

  if (lastSeparatorIndex === -1) {
    throw new Error(`Not a directory: ${path}`);
  }

  return path.substring(0, lastSeparatorIndex);
};

export const OrgImage = ({ src, file }: OrgImageProps) => {
  if (!src.startsWith('http:') && !src.startsWith('https:')) {
    if (src.startsWith('file:')) {
      src = src.replace('file:', '');
    }
    const isAbsolute = src.startsWith('/');

    if (src.startsWith('./')) {
      // relative source
      src = src.replace('./', '');
    }

    if (!isAbsolute) {
      const dir = dirname(file);
      src = join(dir, src);
    }

    src = `http://localhost:35901/img/${encodeURIComponent(src)}`;
  }

  return (
    <Container my={4} position="relative">
      <img
        alt="Failed to load image!"
        src={src}
        style={{ width: 'auto', height: 'auto' }}
      />
    </Container>
  );
};
