import {
  Box,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useTheme,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { ProcessedOrg } from '../../util/processOrg';
import 'katex/dist/katex.css';
import { ThemeContext } from '../../util/themecontext';
import { LinksByNodeId, NodeByCite, NodeById } from '../Home';
import {
  defaultNoteStyle,
  viewerNoteStyle,
  outlineNoteStyle,
} from './noteStyle';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { getThemeColor } from '../../util/getThemeColor';

export interface LinkProps {
  href: any;
  children: any;
  setPreviewNode: any;
  setSidebarHighlightedNode: any;
  nodeByCite: NodeByCite;
  nodeById: NodeById;
  openContextMenu: any;
  outline: boolean;
  linksByNodeId: LinksByNodeId;
  isWiki?: boolean;
  noUnderline?: boolean;
  attachDir: string;
  useInheritance: boolean;
  macros: { [key: string]: string };
}

export interface NodeLinkProps {
  setPreviewNode: any;
  nodeById: NodeById;
  nodeByCite: NodeByCite;
  href: any;
  children: any;
  setSidebarHighlightedNode: any;
  openContextMenu: any;
  isWiki?: boolean;
  noUnderline?: boolean;
  id?: string;
}

export interface NormalLinkProps {
  href: string;
  children: string;
}

export const NodeLink = (props: NodeLinkProps) => {
  const {
    noUnderline,
    id,
    setSidebarHighlightedNode,
    setPreviewNode,
    nodeById,
    openContextMenu,
    href,
    children,
    isWiki,
  } = props;
  const { highlightColor } = useContext(ThemeContext);

  const theme = useTheme();
  const coolHighlightColor = getThemeColor(highlightColor, theme);
  const uri = href.replaceAll(/.*?:(.*)/g, '$1');
  const ID = id ?? uri;
  const linkText = isWiki ? `[[${children}]]` : children;
  return (
    <Text
      as="a"
      onMouseEnter={() => setSidebarHighlightedNode(nodeById[ID])}
      onMouseLeave={() => setSidebarHighlightedNode({})}
      tabIndex={0}
      display="inline"
      overflow="hidden"
      fontWeight={500}
      color={highlightColor}
      textDecoration={noUnderline ? undefined : 'underline'}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenu(nodeById[uri], e);
      }}
      onClick={() => setPreviewNode(nodeById[uri])}
      // TODO  don't hardcode the opacitycolor
      _hover={{
        textDecoration: 'none',
        cursor: 'pointer',
        bgColor: coolHighlightColor + '22',
      }}
      _focus={{ outlineColor: highlightColor }}
    >
      {linkText}
    </Text>
  );
};

export const NormalLink = (props: NormalLinkProps) => {
  const { href, children } = props;
  const { highlightColor } = useContext(ThemeContext);
  return (
    <Link color={highlightColor} isExternal href={href}>
      {children}
      <ExternalLinkIcon mx="1px" pb="2px" />
    </Link>
  );
};

export const PreviewLink = ({
  href,
  children,
  nodeById,
  setSidebarHighlightedNode,
  setPreviewNode,
  nodeByCite,
  openContextMenu,
  outline,
  noUnderline,
  linksByNodeId,
  isWiki,
  macros,
  attachDir,
  useInheritance,
}: LinkProps) => {
  // TODO figure out how to properly type this
  // see https://github.com/rehypejs/rehype-react/issues/25
  const [orgText, setOrgText] = useState<any>(null);
  const [hover, setHover] = useState(false);
  const type = href.replaceAll(/(.*?):.*/g, '$1');

  const extraNoteStyle = outline ? outlineNoteStyle : viewerNoteStyle;

  const getText = () => {
    fetch(`http://localhost:35901/node/${id}`)
      .then((res) => {
        return res.text();
      })
      .then((res) => {
        if (res !== 'error') {
          setOrgText(res);
          return;
        }
      })
      .catch((e) => {
        console.error(e);
        return 'Could not fetch the text for some reason, sorry!\n\n This can happen because you have an id with forward slashes (/) in it.';
      });
  };

  useEffect(() => {
    if (type.replaceAll(/(http)?.*/g, '$1')) {
      return;
    }
    if (orgText) {
      return;
    }
    if (!hover) {
      return;
    }
    getText();
  }, [hover, orgText]);

  if (!type) {
    return <Text color="gray.700">{children}</Text>;
  }

  if (type.replaceAll(/(http)?.*/g, '$1')) {
    return <NormalLink href={href}>{children}</NormalLink>;
  }

  const uri = href.replaceAll(/.*?:(.*)/g, '$1');
  const getId = (type: string, uri: string) => {
    if (type === 'id') {
      return uri;
    }

    if (type.includes('cite')) {
      const node = nodeByCite[uri] ?? false;
      if (!node) {
        return '';
      }
      if (node?.properties.FILELESS) {
        return '';
      }
      return node?.id;
    }
    return '';
  };

  const id = getId(type, uri);

  if (id) {
    return (
      <>
        <Popover gutter={12} trigger="hover" placement="top-start">
          <PopoverTrigger>
            <Box
              display="inline"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <NodeLink
                key={nodeById[id]?.title ?? id}
                {...{
                  id,
                  setSidebarHighlightedNode,
                  setPreviewNode,
                  nodeById,
                  href,
                  children,
                  nodeByCite,
                  openContextMenu,
                  noUnderline,
                  isWiki,
                }}
              />
            </Box>
          </PopoverTrigger>
          <Portal>
            <PopoverContent
              transform="scale(1)"
              key={nodeById[id]?.title ?? id}
              boxShadow="xl"
              position="relative"
              zIndex="tooltip"
              onMouseEnter={() => {
                setSidebarHighlightedNode(nodeById[id] ?? {});
              }}
              onMouseLeave={() => {
                setSidebarHighlightedNode({});
              }}
            >
              <PopoverArrow />
              <PopoverBody
                pb={5}
                fontSize="xs"
                position="relative"
                zIndex="tooltip"
                transform="scale(1)"
                width="100%"
              >
                <Scrollbars
                  autoHeight
                  autoHeightMax={300}
                  autoHide
                  renderThumbVertical={({ style, ...props }) => (
                    <Box
                      style={{
                        ...style,
                        borderRadius: 0,
                        // backgroundColor: highlightColor,
                      }}
                      //color="alt.100"
                      {...props}
                    />
                  )}
                >
                  <Box
                    w="100%"
                    color="black"
                    px={3}
                    sx={{ ...defaultNoteStyle, ...extraNoteStyle }}
                    //overflowY="scroll"
                  >
                    <ProcessedOrg
                      previewText={orgText}
                      {...{
                        nodeById,
                        setSidebarHighlightedNode,
                        setPreviewNode,
                        nodeByCite,
                        openContextMenu,
                        outline,
                        linksByNodeId,
                        macros,
                        attachDir,
                        useInheritance,
                      }}
                      previewNode={nodeById[id]!}
                      collapse={false}
                    />
                  </Box>
                </Scrollbars>
              </PopoverBody>
            </PopoverContent>
          </Portal>
        </Popover>
      </>
    );
  }
  return (
    <Text
      as="span"
      display="inline"
      className={href}
      color="base.700"
      cursor="not-allowed"
    >
      {children}
    </Text>
  );
};
