import React from 'react';
import {
  Menu,
  MenuItem,
  MenuList,
  Heading,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  DeleteIcon,
  EditIcon,
  AddIcon,
  ViewIcon,
  ExternalLinkIcon,
  PlusSquareIcon,
  MinusIcon,
} from '@chakra-ui/icons';

import { OrgRoamNode } from '../api';
import {
  deleteNodeInEmacs,
  openNodeInEmacs,
  createNodeInEmacs,
} from '../util/webSocketFunctions';
import { BiNetworkChart } from 'react-icons/bi';
import { TagMenu } from './TagMenu';
import { initialFilter, TagColors } from './config';

export default interface ContextMenuProps {
  background: boolean;
  target: OrgRoamNode | string | null;
  nodeType?: string;
  coordinates: { [direction: string]: number | undefined };
  handleLocal: (node: OrgRoamNode, add: string) => void;
  menuClose: () => void;
  scope: { nodeIds: string[] };
  webSocket: any;
  setPreviewNode: any;
  setTagColors: any;
  tagColors: TagColors;
  setFilter: any;
  filter: typeof initialFilter;
}

export const ContextMenu = ({
  target,
  coordinates,
  handleLocal,
  menuClose,
  scope,
  webSocket,
  setPreviewNode,
  setTagColors,
  tagColors,
  setFilter,
  filter,
}: ContextMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Menu defaultIsOpen closeOnBlur={false} onClose={() => menuClose()}>
        <MenuList
          zIndex="overlay"
          bgColor="white"
          color="black"
          position="absolute"
          left={coordinates.left}
          top={coordinates.top}
          right={coordinates.right}
          bottom={coordinates.bottom}
          fontSize="xs"
          boxShadow="xl"
        >
          {typeof target !== 'string' ? (
            <>
              {target && (
                <>
                  <Heading size="xs" isTruncated px={3} py={1}>
                    {target.title}
                  </Heading>
                  <MenuDivider borderColor="gray.500" />
                </>
              )}
              {scope.nodeIds.length !== 0 && (
                <>
                  <MenuItem
                    onClick={() => handleLocal(target!, 'add')}
                    icon={<PlusSquareIcon />}
                  >
                    Expand local graph at node
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleLocal(target!, 'replace')}
                    icon={<BiNetworkChart />}
                  >
                    Open local graph for this node
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleLocal(target!, 'remove')}
                    icon={<MinusIcon />}
                  >
                    Exclude node from local graph
                  </MenuItem>
                </>
              )}
              {!target?.properties?.FILELESS ? (
                <MenuItem
                  icon={<EditIcon />}
                  onClick={() =>
                    openNodeInEmacs(target as OrgRoamNode, webSocket)
                  }
                >
                  Open in Emacs
                </MenuItem>
              ) : (
                <MenuItem
                  icon={<AddIcon />}
                  onClick={() => createNodeInEmacs(target, webSocket)}
                >
                  Create node
                </MenuItem>
              )}
              {target?.properties?.ROAM_REFS && (
                <MenuItem icon={<ExternalLinkIcon />}>Open in Zotero</MenuItem>
              )}
              {scope.nodeIds.length === 0 && (
                <MenuItem
                  icon={<BiNetworkChart />}
                  onClick={() => handleLocal(target!, 'replace')}
                >
                  Open local graph
                </MenuItem>
              )}
              <MenuItem
                icon={<ViewIcon />}
                onClick={() => {
                  setPreviewNode(target);
                }}
              >
                Preview
              </MenuItem>
              {target?.level === 0 && (
                <MenuItem
                  closeOnSelect={false}
                  icon={<DeleteIcon color="red.500" />}
                  color="red.500"
                  onClick={onOpen}
                >
                  Permanently delete note
                </MenuItem>
              )}
            </>
          ) : (
            <TagMenu
              {...{ target, tagColors, filter, setTagColors, setFilter }}
            />
          )}
        </MenuList>
      </Menu>
      {typeof target !== 'string' && (
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent zIndex="popover">
            <ModalHeader>Delete node?</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4} display="flex" alignItems="flex-start">
                <Text>This will permanently delete your note:</Text>
                <Text fontWeight="bold">{target?.title}</Text>
                {target?.level !== 0 && (
                  <Text>
                    This will only delete the from this heading until but not
                    including the next node. Your parent file and all other
                    nodes will not be deleted.
                  </Text>
                )}
                <Text>Are you sure you want to do continue?</Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button
                mr={3}
                onClick={() => {
                  console.log('closing');
                  onClose();
                  menuClose();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="link"
                colorScheme="red"
                ml={3}
                onClick={() => {
                  deleteNodeInEmacs(target!, webSocket);
                  onClose();
                  menuClose();
                }}
              >
                Delete node
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};
