import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { initialVisuals } from '../../config';

export interface LabelsPanelProps {
  visuals: typeof initialVisuals;
  setVisuals: any;
}

export const LabelsPanel = ({ visuals, setVisuals }: LabelsPanelProps) => (
  <Flex alignItems="center" justifyContent="space-between" pl={7} pr={2}>
    <Text>Show labels</Text>
    <Menu isLazy placement="right">
      <MenuButton
        as={Button}
        colorScheme=""
        color="black"
        rightIcon={<ChevronDownIcon />}
      >
        {!visuals.labels
          ? 'Never'
          : visuals.labels < 2
            ? 'On Highlight'
            : 'Always'}
      </MenuButton>
      <Portal>
        <MenuList zIndex="popover" bgColor="gray.200">
          <MenuItem onClick={() => setVisuals({ ...visuals, labels: 0 })}>
            Never
          </MenuItem>
          <MenuItem onClick={() => setVisuals({ ...visuals, labels: 1 })}>
            On Highlight
          </MenuItem>
          <MenuItem onClick={() => setVisuals({ ...visuals, labels: 2 })}>
            Always
          </MenuItem>
          <MenuItem onClick={() => setVisuals({ ...visuals, labels: 3 })}>
            Always (even in 3D)
          </MenuItem>
        </MenuList>
      </Portal>
    </Menu>
  </Flex>
);
