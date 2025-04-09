import React from 'react';
import path from 'path';
import { Container } from '@chakra-ui/react';

export interface OrgImageProps {
  src: string;
  file: string;
}

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
      const dir = path.dirname(file);
      src = path.join(dir, src);
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
