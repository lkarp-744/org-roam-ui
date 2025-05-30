import React, { useEffect, useState } from 'react';
import { LinksByNodeId, NodeByCite, NodeById } from '../components/Home';
import { ProcessedOrg } from './processOrg';

export interface UniOrgProps {
  nodeById: NodeById;
  previewNode: any;
  setPreviewNode: any;
  nodeByCite: NodeByCite;
  setSidebarHighlightedNode: any;
  openContextMenu: any;
  outline: boolean;
  collapse: boolean;
  linksByNodeId: LinksByNodeId;
  macros?: { [key: string]: string };
  attachDir: string;
  useInheritance: boolean;
}

export const UniOrg = ({
  openContextMenu,
  setSidebarHighlightedNode,
  nodeById,
  nodeByCite,
  previewNode,
  setPreviewNode,
  outline,
  collapse,
  linksByNodeId,
  macros,
  attachDir,
  useInheritance,
}: UniOrgProps) => {
  const [previewText, setPreviewText] = useState('');

  const id = encodeURIComponent(encodeURIComponent(previewNode.id));
  useEffect(() => {
    fetch(`http://localhost:35901/node/${id}`)
      .then((res) => {
        return res.text();
      })
      .then((res) => {
        if (res === '') {
          return '(empty node)';
        }
        if (res !== 'error') {
          setPreviewText(res);
        }
      })
      .catch((e) => {
        setPreviewText('(could not find node)');
        console.error(e);
        return 'Could not fetch the text for some reason, sorry!\n\n This can happen because you have an id with forward slashes (/) in it.';
      });
  }, [previewNode.id]);

  return (
    <>
      {previewText && previewNode && (
        <ProcessedOrg
          {...{
            nodeById,
            previewNode,
            setPreviewNode,
            previewText,
            nodeByCite,
            setSidebarHighlightedNode,
            openContextMenu,
            outline,
            collapse,
            linksByNodeId,
            attachDir,
            useInheritance,
          }}
          macros={macros || {}}
        />
      )}
    </>
  );
};
