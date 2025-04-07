import { CloseIcon, RepeatClockIcon, SettingsIcon } from '@chakra-ui/icons';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  IconButton,
  Tooltip,
  Heading,
} from '@chakra-ui/react';

import React, { useContext } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import {
  initialFilter,
  initialVisuals,
  initialLocal,
  TagColors,
  colorList,
  initialColoring,
} from '../config';

import FilterPanel from './Filter/FilterPanel';

import { ThemeContext } from '../../util/themecontext';
import { usePersistantState } from '../../util/persistant-state';
import { VisualsPanel } from './Visual/VisualsPanel';

export interface TweakProps {
  filter: typeof initialFilter;
  setFilter: any;
  visuals: typeof initialVisuals;
  setVisuals: any;
  tags: string[];
  tagColors: TagColors;
  setTagColors: any;
  coloring: typeof initialColoring;
  setColoring: any;
  local: typeof initialLocal;
  setLocal: any;
}

export const Tweaks = ({
  filter,
  setFilter,
  visuals,
  setVisuals,
  tags,
  tagColors,
  setTagColors,
  coloring,
  setColoring,
  local,
  setLocal,
}: TweakProps) => {
  const [showTweaks, setShowTweaks] = usePersistantState('showTweaks', false);
  const { highlightColor, setHighlightColor } = useContext(ThemeContext);

  return !showTweaks ? (
    <Box
      position="absolute"
      zIndex="overlay"
      marginTop={1}
      marginLeft={0}
      display={showTweaks ? 'none' : 'block'}
    >
      <IconButton
        variant="subtle"
        aria-label="Settings"
        icon={<SettingsIcon />}
        onClick={() => setShowTweaks(true)}
      />
    </Box>
  ) : (
    <Box
      position="absolute"
      bg="alt.100"
      w="xs"
      marginTop={2}
      marginLeft={2}
      borderRadius="lg"
      paddingBottom={5}
      zIndex={10}
      boxShadow="xl"
      maxH={'95vh'}
      fontSize="sm"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-end"
        paddingRight={2}
        paddingTop={1}
      >
        <Tooltip label="Reset settings to defaults">
          <IconButton
            aria-label="Reset Defaults"
            icon={<RepeatClockIcon />}
            onClick={() => {
              setVisuals(initialVisuals);
              setFilter(initialFilter);
              setColoring(initialColoring);
              setHighlightColor('purple.500');
              setLocal(initialLocal);
            }}
            variant="subtle"
            size="sm"
          />
        </Tooltip>
        <IconButton
          size="sm"
          icon={<CloseIcon />}
          aria-label="Close Tweak Panel"
          variant="subtle"
          onClick={() => setShowTweaks(false)}
        />
      </Box>
      <Scrollbars
        autoHeight
        autoHeightMax={0.85 * globalThis.innerHeight}
        autoHide
        renderThumbVertical={({ style, ...props }) => (
          <Box
            {...props}
            style={{
              ...style,
              borderRadius: 10,
            }}
            bg={highlightColor}
          />
        )}
      >
        <Accordion allowMultiple allowToggle color="black">
          <AccordionItem>
            <AccordionButton>
              <AccordionIcon marginRight={2} />
              <Heading size="sm">Filter</Heading>
            </AccordionButton>
            <AccordionPanel>
              <FilterPanel
                filter={filter}
                setFilter={setFilter}
                tagColors={tagColors}
                setTagColors={setTagColors}
                highlightColor={highlightColor}
                colorList={colorList}
                tags={tags}
                {...{ local, setLocal }}
              />
            </AccordionPanel>
          </AccordionItem>
          <AccordionItem>
            <AccordionButton>
              <AccordionIcon marginRight={2} />
              <Heading size="sm">Visual</Heading>
            </AccordionButton>
            <AccordionPanel>
              <VisualsPanel
                visuals={visuals}
                setVisuals={setVisuals}
                highlightColor={highlightColor}
                setHighlightColor={setHighlightColor}
                {...{
                  coloring,
                  setColoring,
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Scrollbars>
    </Box>
  );
};
