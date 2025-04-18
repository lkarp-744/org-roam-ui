import { LinksByNodeId, NodeByCite, NodeById } from '../Home';

import { NodeObject, LinkObject } from 'force-graph';

import { VStack, Box, StackDivider } from '@chakra-ui/react';
import React from 'react';

export interface BacklinksProps {
  previewNode: NodeObject | OrgRoamNode;
  setPreviewNode: any;
  nodeById: NodeById;
  linksByNodeId: LinksByNodeId;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: OrgRoamNode;
  openContextMenu: any;
  outline: boolean;
  attachDir: string;
  useInheritance: boolean;
  macros: { [key: string]: string };
}

import { PreviewLink } from './Link';
import { OrgRoamNode } from '../../api';
import { normalizeLinkEnds } from '../../util/normalizeLinkEnds';

export const Backlinks = (props: BacklinksProps) => {
  const {
    previewNode,
    setPreviewNode,
    setSidebarHighlightedNode,
    nodeById,
    linksByNodeId,
    nodeByCite,
    openContextMenu,
    outline,
    macros,
    attachDir,
    useInheritance,
  } = props;
  const links = linksByNodeId[(previewNode as OrgRoamNode)?.id] ?? [];

  const backLinks = links
    .filter((link: LinkObject) => {
      const [source] = normalizeLinkEnds(link);
      return source !== previewNode?.id;
    })
    .map((l) => l.source);

  return (
    <Box
      className="backlinks"
      borderRadius="sm"
      mt={6}
      p={4}
      bg="white"
      mb={10}
    >
      <p
        style={{ fontSize: 16, fontWeight: 600 }}
      >{`Linked references (${backLinks.length})`}</p>
      <VStack
        py={2}
        spacing={3}
        alignItems="start"
        divider={<StackDivider borderColor="gray.500" />}
        align="stretch"
        color="gray.800"
      >
        {previewNode?.id &&
          backLinks.map((link) => {
            return (
              <Box
                overflow="hidden"
                py={1}
                borderRadius="sm"
                width="100%"
                key={link}
              >
                <PreviewLink
                  linksByNodeId={linksByNodeId}
                  nodeByCite={nodeByCite}
                  setSidebarHighlightedNode={setSidebarHighlightedNode}
                  href={`id:${link as string}`}
                  nodeById={nodeById}
                  setPreviewNode={setPreviewNode}
                  openContextMenu={openContextMenu}
                  outline={outline}
                  noUnderline
                  {...{ attachDir, useInheritance, macros }}
                >
                  {nodeById[link as string]?.title}
                </PreviewLink>
              </Box>
            );
          })}
      </VStack>
    </Box>
  );
};
