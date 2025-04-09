import { Box, Flex, Text, Switch } from '@chakra-ui/react';
import React from 'react';
import { initialVisuals } from '../config';

export interface CitationsPanelProps {
  visuals: typeof initialVisuals;
  setVisuals: any;
}

export const CitationsPanel = (props: CitationsPanelProps) => {
  const { visuals, setVisuals } = props;
  return (
    <Box>
      <Flex justifyContent="space-between">
        {/* Add dashes to citation links made with org-roam-bibtex */}
        <Text>Dash cite links</Text>
        <Switch
          isChecked={visuals.citeDashes}
          onChange={() =>
            setVisuals({ ...visuals, citeDashes: !visuals.citeDashes })
          }
        ></Switch>
      </Flex>
      <Flex justifyContent="space-between">
        {/* Add dashes to citation links, whose target has a note, made with org-roam-bibtex*/}
        <Text>Dash ref links</Text>
        <Switch
          isChecked={visuals.refDashes}
          onChange={() =>
            setVisuals({ ...visuals, refDashes: !visuals.refDashes })
          }
        ></Switch>
      </Flex>
    </Box>
  );
};
