import {
  Text,
  Accordion,
  AccordionButton,
  AccordionItem,
  Flex,
  VStack,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { HighlightingPanel } from './HighlightingPanel';
import { ColorsPanel } from './ColorsPanel';
import { initialColoring, initialVisuals } from '../../config';
import { LabelsPanel } from './LabelsPanel';
import { ThemeSelect } from './ThemeSelect';
import { CitationsPanel } from '../CitationsPanel';
import { GraphColorSelect } from './GraphColorSelect';

export interface VisualsPanelProps {
  visuals: typeof initialVisuals;
  setVisuals: any;
  highlightColor: string;
  setHighlightColor: any;
  coloring: typeof initialColoring;
  setColoring: any;
}

export const VisualsPanel = ({
  coloring,
  setColoring,
  visuals,
  setVisuals,
  highlightColor,
  setHighlightColor,
}: VisualsPanelProps) => {
  const setVisualsCallback = useCallback((val: unknown) => setVisuals(val), []);

  return (
    <VStack justifyContent="flex-start" align="stretch">
      <ThemeSelect />
      <GraphColorSelect {...{ coloring, setColoring }} />
      <LabelsPanel visuals={visuals} setVisuals={setVisualsCallback} />
      <HighlightingPanel visuals={visuals} setVisuals={setVisualsCallback} />
      <Accordion allowToggle defaultIndex={[0]} paddingLeft={3}>
        <AccordionItem>
          <AccordionButton>
            <Flex justifyContent="space-between" w="100%">
              <Text>Colors</Text>
              <AccordionIcon marginRight={2} />
            </Flex>
          </AccordionButton>
          <AccordionPanel>
            <ColorsPanel
              visuals={visuals}
              setVisualsCallback={setVisualsCallback}
              highlightColor={highlightColor}
              setHighlightColor={setHighlightColor}
            />
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Flex justifyContent="space-between" w="100%">
              <Text>Citations</Text>
              <AccordionIcon marginRight={2} />
            </Flex>
          </AccordionButton>
          <AccordionPanel>
            <CitationsPanel visuals={visuals} setVisuals={setVisualsCallback} />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};
