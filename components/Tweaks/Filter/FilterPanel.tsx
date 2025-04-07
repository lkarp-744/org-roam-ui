import {
  Text,
  Box,
  Flex,
  StackDivider,
  VStack,
  Switch,
} from '@chakra-ui/react';
import React from 'react';
import { initialFilter, TagColors } from '../../config';

export interface FilterPanelProps {
  filter: typeof initialFilter;
  setFilter: any;
  tagColors: TagColors;
  setTagColors: any;
}

const FilterPanel = ({
  filter,
  setFilter,
  tagColors,
  setTagColors,
}: FilterPanelProps) => (
  <Box>
    <VStack
      spacing={2}
      justifyContent="flex-start"
      divider={<StackDivider borderColor="gray.500" />}
      align="stretch"
      paddingLeft={7}
      color="gray.800"
    >
      <Flex justifyContent="space-between">
        <Text>Orphans</Text>
        <Switch
          onChange={() => {
            setFilter((curr: typeof initialFilter) => {
              return { ...curr, orphans: !curr.orphans };
            });
          }}
          isChecked={filter.orphans}
        ></Switch>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Dailies</Text>
        <Switch
          onChange={() => {
            setFilter((curr: typeof initialFilter) => {
              return { ...curr, dailies: !curr.dailies };
            });
          }}
          isChecked={filter.dailies}
        ></Switch>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Org-noter pages</Text>
        <Switch
          onChange={() => {
            setFilter((curr: typeof initialFilter) => {
              return { ...curr, noter: !curr.noter };
            });
          }}
          isChecked={filter.noter}
        ></Switch>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Citations without note files</Text>
        <Switch
          onChange={() => {
            setFilter({ ...filter, filelessCites: !filter.filelessCites });
          }}
          isChecked={filter.filelessCites}
        ></Switch>
      </Flex>
      <Flex justifyContent="space-between">
        <Text>Non-existent nodes</Text>
        <Switch
          onChange={() => {
            setTagColors({ ...tagColors, bad: 'white' });
            setFilter({ ...filter, bad: !filter.bad });
          }}
          isChecked={filter.bad}
        ></Switch>
      </Flex>
    </VStack>
  </Box>
);

export default FilterPanel;
