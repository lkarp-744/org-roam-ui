import { unified } from 'unified';
import * as prod from 'react/jsx-runtime';
import uniorgParse from 'uniorg-parse';
import uniorg2rehype from 'uniorg-rehype';
import uniorgSlug from 'uniorg-slug';
import extractKeywords from 'uniorg-extract-keywords';
import attachments from 'uniorg-attach';
import katex from 'rehype-katex';
import 'katex/dist/katex.css';
import rehype2react from 'rehype-react';

import remarkParse from 'remark-parse';
import remarkGFM from 'remark-gfm';
import remarkWikiLinks from 'remark-wiki-link';
import remarkMath from 'remark-math';
import remarkFrontMatter from 'remark-frontmatter';
import remarkExtractFrontMatter from 'remark-extract-frontmatter';
import remarkSectionize from 'remark-sectionize';
import remarkRehype from 'remark-rehype';

import { PreviewLink } from '../components/Sidebar/Link';
import { LinksByNodeId, NodeByCite, NodeById } from '../pages';
import React, { ReactNode, useMemo } from 'react';
import { OrgImage } from '../components/Sidebar/OrgImage';
import { Section } from '../components/Sidebar/Section';
import { NoteContext } from './NoteContext';
import { OrgRoamLink, OrgRoamNode } from '../api';

import { Box, chakra } from '@chakra-ui/react';
import { normalizeLinkEnds } from './normalizeLinkEnds';

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

export const ProcessedOrg = (props: ProcessedOrgProps) => {
  const {
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
  } = props;

  if (!previewNode) return null;
  if (!linksByNodeId) return null;

  const orgProcessor = unified()
    .use(uniorgParse)
    .use(extractKeywords)
    .use(attachments, {
      idDir: attachDir || undefined,
      useInheritance,
    })
    .use(uniorgSlug)
    .use(uniorg2rehype, { useSections: true });

  const nodesInNote =
    linksByNodeId[previewNode.id!]?.reduce(
      (acc: NodeById, link: OrgRoamLink) => {
        const links = normalizeLinkEnds(link);
        const relevantLink = links.filter((l) => l !== previewNode.id).join('');
        return {
          ...acc,
          [relevantLink]: nodeById[relevantLink],
        };
      },
      {}
    ) || {};

  const linkEntries = Object.entries(nodesInNote);
  const wikiLinkResolver = (wikiLink: string): string[] => {
    const entry = linkEntries.find((idNodeArray) => {
      return idNodeArray?.[1]?.title === wikiLink;
    });
    const id = entry?.[0] ?? '';
    return [id];
  };

  const wikiLinkProcessor = (wikiLink: string): string => {
    return `id:${wikiLink}`;
  };

  const mdProcessor = unified()
    .use(remarkParse)
    .use(remarkFrontMatter, ['yaml'])
    .use(remarkExtractFrontMatter)
    .use(remarkWikiLinks, {
      permaLinks: Object.keys(nodesInNote),
      pageResolver: wikiLinkResolver,
      hrefTemplate: wikiLinkProcessor,
    })
    .use(remarkSectionize)
    .use(remarkMath)
    .use(remarkGFM)
    .use(remarkRehype);
  //.data('settings', { fragment: true })
  // .use(highlight)

  const isMarkdown = previewNode?.file?.slice(-3) === '.md';
  const baseProcessor: any = isMarkdown ? mdProcessor : orgProcessor;

  const processor = useMemo(
    () =>
      baseProcessor
        .use(katex, {
          trust: (context: any) =>
            ['\\htmlId', '\\href'].includes(context.command),
          macros: {
            '\\eqref': '\\href{###1}{(\\text{#1})}',
            '\\ref': '\\href{###1}{\\text{#1}}',
            '\\label': '\\htmlId{#1}{}',
            // '\\weird': '\\textbf{#1}',
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
                  isWiki={isMarkdown}
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
