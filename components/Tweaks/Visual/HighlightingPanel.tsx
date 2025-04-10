import React from 'react';
import { colorList, initialVisuals } from '../../config';
import { ColorMenu } from './ColorMenu';
import { Box, Collapse, Flex, Switch, Text } from '@chakra-ui/react';

export interface HighlightingPanelProps {
  visuals: typeof initialVisuals;
  setVisuals: any;
}

export const HighlightingPanel = ({
  visuals,
  setVisuals,
}: HighlightingPanelProps) => (
  <Flex
    key="Highlighting"
    flexDirection="column"
    pt={2}
    justifyContent="space-between"
    pl={7}
    pr={2}
  >
    <Box display="flex" justifyContent="space-between" paddingBottom={2}>
      <Text>Highlighting</Text>
      <Switch
        isChecked={visuals.highlight}
        onChange={() =>
          setVisuals((visuals: typeof initialVisuals) => ({
            ...visuals,
            highlight: !visuals.highlight,
          }))
        }
      />
    </Box>
    <Collapse in={visuals.highlight} animateOpacity>
      <Box paddingLeft={4} paddingTop={2} paddingBottom={2}>
        <ColorMenu
          colorList={colorList}
          label="Link highlight"
          setVisuals={setVisuals}
          value="linkHighlight"
          visValue={visuals.linkHighlight}
        />
        <ColorMenu
          colorList={colorList}
          label="Node highlight"
          setVisuals={setVisuals}
          value="nodeHighlight"
          visValue={visuals.nodeHighlight}
        />
      </Box>
    </Collapse>
  </Flex>
);
