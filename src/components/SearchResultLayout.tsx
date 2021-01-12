import React, { useState, useEffect, Dispatch } from "react";
import styled from "styled-components";
import { Layers } from "react-feather";

import { animated, useSpring, config } from "react-spring";
import { useDrag } from "react-use-gesture";

import { HorizontalWrapper } from "components/Wrappers";
import MovieResults from "components/MovieResults";
import Nominations, { getWidth } from "components/Nominations";
import { Background } from "components/MovieInfoPopup";
import { fontSans } from "components/Text";

import { Result, isOk } from "lib/result";
import { Movie } from "lib/movieModel";

import useWindowDimensions from "hooks/useWindowDimensions";

import {
  NominationActionTypes,
  NominationsAction,
  NominationsState,
} from "reducers/nominationReducer";

const FrontDiv = styled(animated.div)`
  z-index: 20;
  user-select: none;
  touch-action: pan-y;
`;

const OpenNominations = styled(animated.button)`
  border: none;
  background-color: #2979ff;
  color: white;

  z-index: 19;
  position: fixed;

  right: 0;
  bottom: 0;
  margin-right: 15px;
  margin-bottom: 15px;

  padding: 10px;

  border-radius: 3px;
  font: bold 15px ${fontSans};

  align-items: center;
  justify-content: center;
`;

const menuSwipeWidth = 716;

const SearchResultLayout = ({
  nominations,
  nominationsDispatch,
  searchResults,
  displayMovieInfo,
}: {
  nominations: NominationsState;
  nominationsDispatch: Dispatch<NominationsAction>;
  searchResults: Result<[Array<Movie>, number]>;
  displayMovieInfo: (movie: Movie) => void;
}) => {
  const { width: windowWidth } = useWindowDimensions(10);

  const width = getWidth(1);
  const closedPosition = width;
  const openPosition = 0;
  const smallScreen = windowWidth < menuSwipeWidth;
  const [{ x }, set] = useSpring(() => ({ x: closedPosition }));

  const open = (canceled: boolean) => {
    set({
      x: openPosition,
      immediate: false,
      config: canceled ? config.wobbly : config.stiff,
    });
  };

  const close = (velocity = 0) => {
    set({
      x: closedPosition,
      immediate: false,
      config: { ...config.stiff, velocity },
    });
  };

  const bind = useDrag(
    ({ vxvy: [vx], movement: [mx], cancel, canceled, last }) => {
      if (smallScreen) {
        if (mx < windowWidth * -0.07) {
          cancel();
        }

        if (last) {
          if (mx > width * 0.5 || vx > 0.5) {
            close(vx);
          } else {
            open(canceled);
          }
        } else {
          set({ x: mx });
        }
      }
    },
    {
      initial: () => [x.get(), 0],
      bounds: { left: openPosition, right: width },
      rubberband: true,
      axis: "x",
    }
  );

  const backgroundStyle = {
    opacity: x.to([openPosition, closedPosition], [1, 0], "clamp"),
    display: x.to((xPos) => (xPos === closedPosition ? "none" : "block")),
    zIndex: 20,
  };

  useEffect(() => {
    if (!nominations.modifiedOrder.length) {
      close();
    }
  }, [nominations.modifiedOrder.length]);

  useEffect(() => {
    close();
  }, [windowWidth]);

  const boxShadow = {
    boxShadow: x.to((xPos) =>
      xPos === closedPosition ? "5px 3px 7px 1px #F2F2F2" : "none"
    ),
  };

  const shouldShowOpacity = smallScreen ? 1 : 0;

  const [buttonHover, setButtonHover] = useState<boolean>(false);

  const { opacity: buttonOpacity, shadow: buttonShadow } = useSpring({
    opacity: nominations.modifiedOrder.length ? shouldShowOpacity : 0,
    shadow: buttonHover ? 5 : 3,
  });

  const buttonStyle = {
    opacity: buttonOpacity,
    display: buttonOpacity.to((opacity) => (opacity === 0 ? "none" : "flex")),
    boxShadow: buttonShadow.to(
      (shadow) =>
        `${shadow}px ${shadow}px ${shadow * 1.8}px ${shadow}px hsl(0deg, 0%, ${
          100 - shadow * 2
        }%)`
    ),
  };

  return (
    <HorizontalWrapper>
      <MovieResults
        movies={isOk(searchResults) ? searchResults[0] : []}
        movieOnInfo={displayMovieInfo}
        movieOnNominate={(movie: Movie) => {
          nominationsDispatch({ type: NominationActionTypes.ADD, movie });
        }}
        nominated={nominations.nominations}
        nominatedDisabled={nominations.nominatedDisabled}
      />
      <Background style={backgroundStyle as any} onClick={() => close()} />
      <FrontDiv
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...bind()}
        style={
          smallScreen
            ? {
                position: "fixed",
                top: 0,
                left: 0,
                transform: x
                  .to(
                    [openPosition, closedPosition],
                    [windowWidth - width - 10, windowWidth],
                    "extend"
                  )
                  .to((xPos) => `translate3d(${xPos}px, 0, 0)`),
              }
            : { position: "relative" }
        }
      >
        <Nominations
          movieOnInfo={displayMovieInfo}
          removeOnClick={({ id }) => {
            nominationsDispatch({
              type: NominationActionTypes.REMOVE,
              movieId: id,
            });
          }}
          modifiedOrder={nominations.modifiedOrder}
          nominations={nominations.nominations}
          customStyle={boxShadow as any}
        />
      </FrontDiv>
      <OpenNominations
        style={buttonStyle as any}
        onClick={() => open(false)}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
      >
        <Layers width={24} height={24} style={{ marginRight: 7 }} />
        Nominations
      </OpenNominations>
    </HorizontalWrapper>
  );
};

export default SearchResultLayout;
