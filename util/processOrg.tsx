import { unified } from 'unified';
import * as prod from 'react/jsx-runtime';
import uniorgParse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import uniorgSlug from 'uniorg-slug';
import extractKeywords from 'uniorg-extract-keywords';
import attachments from 'uniorg-attach';
import katex from 'rehype-katex';
import rehype2react from 'rehype-react';

import { PreviewLink } from '../components/Sidebar/Link';
import { LinksByNodeId, NodeByCite, NodeById } from '../components/Home';
import React, { ReactNode, useMemo } from 'react';
import { OrgImage } from '../components/Sidebar/OrgImage';
import { Section } from '../components/Sidebar/Section';
import { NoteContext } from './NoteContext';
import { OrgRoamNode } from '../api';

import { Box, chakra } from '@chakra-ui/react';

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

export interface ProcessedOrgProps {
  nodeById: NodeById;
  previewNode: OrgRoamNode;
  setPreviewNode: any;
  previewText: any;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: any;
  openContextMenu: any;
  outline: boolean;
  collapse: boolean;
  linksByNodeId: LinksByNodeId;
  macros: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

export const ProcessedOrg = ({
  nodeById,
  setSidebarHighlightedNode,
  setPreviewNode,
  previewText,
  nodeByCite,
  previewNode,
  openContextMenu,
  outline,
  collapse,
  linksByNodeId,
  macros,
  attachDir,
  useInheritance,
}: ProcessedOrgProps) => {
  if (!previewNode) return null;
  if (!linksByNodeId) return null;

  const orgProcessor: any = unified()
    .use(uniorgParse)
    .use(extractKeywords)
    .use(attachments, {
      idDir: attachDir || undefined,
      useInheritance,
    })
    .use(uniorgSlug)
    .use(uniorg2rehype, { useSections: true });

  const processor = useMemo(
    () =>
      orgProcessor
        .use(katex, {
          trust: (context: any) =>
            ['\\htmlId', '\\href'].includes(context.command),
          macros: {
            '\\eqref': '\\href{###1}{(\\text{#1})}',
            '\\ref': '\\href{###1}{\\text{#1}}',
            '\\label': '\\htmlId{#1}{}',
            ...macros,
          },
        })
        .use(rehype2react, {
          ...production,
          components: {
            a: ({ children, href }: { children: unknown; href: unknown }) => {
              return (
                <PreviewLink
                  nodeByCite={nodeByCite}
                  setSidebarHighlightedNode={setSidebarHighlightedNode}
                  href={`${href as string}`}
                  nodeById={nodeById}
                  linksByNodeId={linksByNodeId}
                  setPreviewNode={setPreviewNode}
                  openContextMenu={openContextMenu}
                  outline={outline}
                  isWiki={false}
                  macros={macros}
                  attachDir={attachDir}
                  useInheritance={useInheritance}
                >
                  {children}
                </PreviewLink>
              );
            },
            img: ({ src }: { src: string }) => {
              return <OrgImage src={src} file={previewNode?.file} />;
            },
            section: ({
              children,
              className,
            }: {
              children: ReactNode;
              className: string;
            }) => {
              if (className && className.slice(-1) === `${previewNode.level}`) {
                return <Box>{(children as React.ReactElement[]).slice(1)}</Box>;
              }
              return (
                <Section
                  {...{ outline, collapse }}
                  className={className as string}
                >
                  {children}
                </Section>
              );
            },
            blockquote: ({ children }: { children: ReactNode }) => (
              <chakra.blockquote
                color="gray.800"
                bgColor="gray.300"
                pt={4}
                pb={2}
                mb={4}
                mt={3}
                pl={4}
                borderLeftWidth={4}
                borderLeftColor="gray.700"
              >
                {children}
              </chakra.blockquote>
            ),
            p: ({ children }: { children: ReactNode }) => {
              return <p lang="en">{children}</p>;
            },
          },
        }),
    [previewNode?.id]
  );

  const text = useMemo(
    () => processor.processSync(previewText).result,
    [previewText]
  );
  return (
    <NoteContext.Provider value={{ collapse, outline }}>
      {text as ReactNode}
    </NoteContext.Provider>
  );
};
