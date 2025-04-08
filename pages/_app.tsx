import '../styles/globals.css';
import {
  ChakraProvider,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import * as d3int from 'd3-interpolate';

import {
  ThemeContext,
  ThemeMap,
  Theme,
  initialTheme,
  initialHighlightColor,
} from '../util/themecontext';
import Home from '../components/Home';

const getBorderColor = (
  highlightColor: string,
  themeColors: ThemeMap
): undefined | string => {
  if (highlightColor === 'purple.500') {
    return `${themeColors['violet']}aa`;
  }
  if (highlightColor === 'pink.500') {
    return `${themeColors['magenta']}aa`;
  }
  if (highlightColor === 'blue.500') {
    return `${themeColors['blue']}aa`;
  }
  if (highlightColor === 'cyan.500') {
    return `${themeColors['cyan']}aa`;
  }
  if (highlightColor === 'green.500') {
    return `${themeColors['green']}aa`;
  }
  if (highlightColor === 'yellow.500') {
    return `${themeColors['yellow']}aa`;
  }
  if (highlightColor === 'orange.500') {
    return `${themeColors['orange']}aa`;
  }
  if (highlightColor === 'red.500') {
    return `${themeColors['red']}aa`;
  }

  return undefined;
};

const constructTheme = (highlightColor: string, emacsTheme: Theme) => {
  const themeColors: ThemeMap = emacsTheme[1] as ThemeMap;

  const borderColor = getBorderColor(highlightColor, themeColors);
  const missingColor = d3int.interpolate(
    themeColors['base1'],
    themeColors['base2']
  )(0.2);

  return {
    colors: {
      white: themeColors['bg'],
      black: themeColors['fg'],
      gray: {
        100: themeColors['base1'],
        200: missingColor,
        300: themeColors['base2'],
        400: themeColors['base3'],
        500: themeColors['base4'],
        600: themeColors['base5'],
        700: themeColors['base6'],
        800: themeColors['base7'],
        900: themeColors['base8'],
      },
      blue: {
        500: themeColors['blue'],
      },
      teal: {
        500: themeColors['blue'],
      },
      yellow: {
        500: themeColors['yellow'],
      },
      orange: {
        500: themeColors['orange'],
      },
      red: {
        500: themeColors['red'],
      },
      green: {
        500: themeColors['green'],
      },
      purple: {
        500: themeColors['violet'],
      },
      pink: {
        500: themeColors['magenta'],
      },
      cyan: {
        500: themeColors['cyan'],
      },
      alt: {
        100: themeColors['bg-alt'],
        900: themeColors['fg-alt'],
      },
    },
    shadows: {
      outline: '0 0 0 3px ' + borderColor,
    },
    components: {
      Button: {
        variants: {
          outline: {
            border: '2px solid',
            borderColor: highlightColor,
            color: highlightColor,
          },
          ghost: {
            color: highlightColor,
            _hover: {
              bg: `inherit`,
              border: '1px solid',
              borderColor: highlightColor,
            },
            _active: { color: `inherit`, bg: highlightColor },
          },
          subtle: {
            color: 'gray.800',
            _hover: { bg: `inherit`, color: highlightColor },
            _active: { color: `inherit`, bg: borderColor },
          },
        },
      },
      Accordion: {
        baseStyle: {
          container: {
            marginTop: '10px',
            borderWidth: '0px',
            _last: {
              borderWidth: '0px',
            },
          },
          panel: {
            marginRight: '10px',
          },
        },
      },
      Slider: {
        baseStyle: () => ({
          thumb: {
            backgroundColor: highlightColor,
          },
          filledTrack: {
            backgroundColor: 'gray.400',
          },
          track: {
            backgroundColor: 'gray.400',
            borderColor: 'gray.400',
            borderWidth: '5px',
            borderRadius: 'lg',
          },
        }),
      },
    },
  };
};

function App() {
  const [emacsTheme, setEmacsTheme] = useState<Theme>(initialTheme);
  const [highlightColor, setHighlightColor] = useState(initialHighlightColor);

  const theme = useMemo(() => {
    return constructTheme(highlightColor, emacsTheme);
  }, [highlightColor, JSON.stringify(emacsTheme)]);

  const extendedTheme = extendTheme(
    theme,
    withDefaultColorScheme({ colorScheme: highlightColor.split('.')[0] })
  );

  return (
    <ThemeContext.Provider
      value={{
        emacsTheme: emacsTheme,
        setEmacsTheme: setEmacsTheme,
        highlightColor: highlightColor,
        setHighlightColor: setHighlightColor,
      }}
    >
      <ChakraProvider theme={extendedTheme}>
        <Home />
      </ChakraProvider>
    </ThemeContext.Provider>
  );
}

export default App;
