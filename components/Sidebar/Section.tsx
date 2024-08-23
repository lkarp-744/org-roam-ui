import { Box, Flex, IconButton } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { VscCircleFilled, VscCircle } from 'react-icons/vsc';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { NoteContext } from '../../util/NoteContext';

export interface SectionProps {
  children: any;
  className: string;
}

type SectionButtonProps = {
  label: string;
  className: 'viewerHeadingButton' | 'outlineHeadingButton';
  icon: any;
  onClick: (e: React.MouseEvent) => void;
};

const SectionButton = ({
  label,
  onClick,
  className,
  icon,
}: SectionButtonProps) => (
  <IconButton
    className={className}
    _focus={{}}
    _active={{}}
    aria-label={label}
    //mr={1}
    size="xs"
    variant="subtle"
    icon={icon}
    onClick={onClick}
    height={2}
    width={2}
  />
);

export const Section = ({ children, className }: SectionProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const { collapse } = useContext(NoteContext);
  useEffect(() => {
    setIsOpen(!collapse);
  }, [collapse]);

  if (className === 'h0Wrapper headingWrapper') {
    return <Box className="preHeadingContent"> {children}</Box>;
  }
  const [head, ...rest] = Array.isArray(children) ? children : [children];

  return (
    <Box className={'sec'}>
      <Box display="block">
        <Flex className="headingFlex" alignItems="baseline">
          {isOpen ? (
            <>
              <SectionButton
                label={'Collapse heading'}
                className={'viewerHeadingButton'}
                icon={<ChevronDownIcon />}
                onClick={() => setIsOpen(!isOpen)}
              />
              <SectionButton
                label={'Collapse heading'}
                className={'outlineHeadingButton'}
                icon={<VscCircleFilled />}
                onClick={() => setIsOpen(!isOpen)}
              />
            </>
          ) : (
            <>
              <SectionButton
                label={'Expand heading'}
                className={'viewerHeadingButton'}
                icon={<ChevronUpIcon />}
                onClick={() => setIsOpen(!isOpen)}
              />
              <SectionButton
                label={'Expand heading'}
                className={'outlineHeadingButton'}
                icon={<VscCircle />}
                onClick={() => setIsOpen(!isOpen)}
              />
            </>
          )}
          {head}
        </Flex>
      </Box>
      {isOpen && rest.length > 0 && (
        <Box className="sectionContent">{rest}</Box>
      )}
    </Box>
  );
};
