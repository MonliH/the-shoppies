import React, { ReactNode, useState, useRef, useLayoutEffect } from "react";
import styled from "styled-components";
import { animated, useSpring } from "react-spring";
import * as FeatherIcons from "react-feather";

import {
  VerticalWrapper,
  FullHorizontalWrapper,
  HorizontalWrapper,
} from "components/Wrappers";
import { MovieImage } from "components/MovieCard";
import { MediumHeading, NormalTextSmall } from "components/Text";
import { BigButton, RemoveButton } from "components/Widget";

import { FullMovie } from "lib/movieModel";
import { getLinkHighRes, addAnd } from "lib/api";

import useDebounce from "hooks/useDebounce";

const PopupContainer = styled(animated.div)`
  background: none;
  position: fixed;
  z-index: 25;

  margin: 0;
  padding: 0;

  top: 0;
  left: 0;

  align-items: center;
  justify-content: center;

  /* Cover the entire viewport */
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Background = styled(animated.div)`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);

  position: fixed;

  margin: 0;
  padding: 0;

  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
`;

const PopupWrapper = styled(animated.div)`
  position: relative;
  border-radius: 4px;
  width: fit-content;
  height: fit-content;
  overflow: hidden;
`;

const Popup = styled.div`
  width: fit-content;
  height: fit-content;
  max-height: 80vh;
  max-width: 1000px;

  position: relative;

  margin: 0;
  padding: 30px;

  background-color: ${(props) => props.theme.backgroundTwo};

  @media (max-width: 1065px) {
    max-width: 95vw;
  }

  @media (max-width: 917px) {
    overflow-y: scroll;
    overflow-x: hidden;
  }
`;

const MovieInfoImage = styled(MovieImage)`
  width: 100%;
  height: 100%;
  max-width: 100%;
  font-size: 64px;
  margin-right: 20px;
  object-fit: cover;
`;

const MovieFactDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: fit-content;
  margin-bottom: 10px;
`;

const IconWrapper = styled.div`
  margin: 0;
  padding: 0;
  margin-right: 7px;
`;

const TextWrapper = styled.div`
  margin-top: 3px;
`;

const FactsWrapper = styled(VerticalWrapper)`
  padding-right: 30px;
  margin-top: 20px;
  max-width: 550px;
  height: fit-content;
  max-height: calc(80vh - 80px);
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 917px) {
    max-height: none;
  }
`;

const MovieFact = <T,>({
  children,
  Icon,
  value,
  notFoundText,
}: {
  children: ReactNode;
  Icon: React.FC<FeatherIcons.IconProps>;
  value?: T | null;
  notFoundText?: string;
}) => (
  <MovieFactDiv>
    <IconWrapper>
      <Icon size={24} />
    </IconWrapper>
    <TextWrapper>
      {value !== null ? (
        children
      ) : (
        <NormalTextSmall>{notFoundText}</NormalTextSmall>
      )}
    </TextWrapper>
  </MovieFactDiv>
);

const MovieHorizontalWrapper = styled(HorizontalWrapper)`
  margin-bottom: 10px;
`;

const MovieHeading = styled(MediumHeading)`
  margin-right: 10px;
  margin-bottom: 0px;
  margin-top: 10px;
`;

const InfoClose = styled(RemoveButton)`
  position: absolute;
  top: 21px;
  right: 16px;

  color: black;
  z-index: 26;

  @media (max-width: 917px) {
    background-color: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    border-radius: 2px;
    width: 35px;
    height: 35px;
    right: 20px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MovieInfoPopup = ({
  fullInfo,
  visible,
  onClose,
  onNominate,
  onRemove,
  onFade,
  nominated,
}: {
  fullInfo: FullMovie | null;
  visible: boolean;
  onClose: () => void;
  onNominate: () => void;
  onRemove: () => void;
  onFade: () => void;
  nominated: boolean;
}) => {
  const popupStyle = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? 0 : -100,
    onRest: () => {
      if (!visible) {
        onFade();
      }
    },
  });

  const backgroundStyle = useSpring({
    opacity: visible ? 1 : 0,
  });

  const display = backgroundStyle.opacity.to((bgOpacity) =>
    popupStyle.opacity.to((popupOpacity) => {
      return bgOpacity === 0 && popupOpacity === 0 ? "none" : "flex";
    })
  );

  const ref = useRef<HTMLDivElement | null>(null);
  const [[width, height, windowWidth], setHeightWidth] = useState<
    [number, number, number]
  >([0, 0, 0]);

  const debounceSetHeight = useDebounce(() => {
    if (ref?.current?.offsetHeight && ref?.current?.offsetWidth) {
      const calculatedWidth = ref.current.offsetWidth;
      const calculatedHeight = ref.current.offsetHeight;
      if (calculatedHeight !== height && calculatedWidth !== width) {
        setHeightWidth([calculatedWidth, calculatedHeight, window.innerWidth]);
      }
    }
  }, 300);

  useLayoutEffect(() => {
    debounceSetHeight();

    window.addEventListener("resize", debounceSetHeight);
    return () => {
      window.removeEventListener("resize", debounceSetHeight);
    };
  }, []);

  // Maintain movie aspect ratio
  const largeLayout = windowWidth > 917;
  const imageWidth = largeLayout ? height / 1.583 : width;
  const imageHeight = largeLayout ? height : width * 1.583;

  return fullInfo ? (
    // Again, the `as any` casts are needed because of a bug in react spring:
    // https://github.com/react-spring/react-spring/issues/1102
    <PopupContainer style={{ display } as any}>
      <Background style={{ ...backgroundStyle } as any} onClick={onClose} />
      <PopupWrapper
        style={
          {
            ...popupStyle,
            transform: popupStyle.transform.to(
              (offset) => `translate3d(0, ${offset}vh, 0)`
            ),
          } as any
        }
      >
        <InfoClose onClick={onClose} marginTop={0} marginRight={0}>
          <FeatherIcons.X size={23} color={largeLayout ? "black" : "white"} />
        </InfoClose>
        <Popup>
          <FullHorizontalWrapper breakpoint="917px">
            <MovieInfoImage
              url={getLinkHighRes(fullInfo.posterUrl)}
              fallbackTitle={fullInfo.title}
              iconSize={64}
              style={{
                minWidth: imageWidth,
                width: imageWidth,
                maxWidth: imageWidth,

                minHeight: imageHeight,
                height: imageHeight,
                maxHeight: imageHeight,
              }}
            />
            <FactsWrapper
              ref={(val) => {
                if (val && !ref.current) {
                  ref.current = val;
                  debounceSetHeight();
                }
              }}
            >
              <MovieHorizontalWrapper>
                <MovieHeading>{fullInfo.title}</MovieHeading>
                {nominated ? (
                  <BigButton onClick={onRemove}>Remove</BigButton>
                ) : (
                  <BigButton onClick={onNominate}>Nominate</BigButton>
                )}
              </MovieHorizontalWrapper>
              <MovieFact
                Icon={FeatherIcons.Calendar}
                value={fullInfo.releaseDate}
                notFoundText="Date not found"
              >
                <NormalTextSmall>
                  Released on{" "}
                  <b>{new Date(fullInfo.releaseDate!).toLocaleDateString()}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.User}
                value={fullInfo.director}
                notFoundText="Director not found"
              >
                <NormalTextSmall>
                  Directed by <b>{fullInfo.director}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact Icon={FeatherIcons.Users}>
                <NormalTextSmall>
                  Starring <b>{addAnd(fullInfo.actors)}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.FileText}
                value={fullInfo.plot}
                notFoundText="Summary not available"
              >
                <NormalTextSmall>
                  <b>Synopsis</b>: {fullInfo.plot}
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Film}
                value={fullInfo.ageRating}
                notFoundText="Not rated for age"
              >
                <NormalTextSmall>
                  Rated <b>{fullInfo.ageRating}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Database}
                value={fullInfo.imdbRating}
                notFoundText="Not ranked on IMDB"
              >
                <NormalTextSmall>
                  Ranked{" "}
                  <b>
                    {fullInfo.imdbRating}
                    /10
                  </b>{" "}
                  on IMDB{" "}
                  {fullInfo.imdbVotes !== null ? (
                    <b>{fullInfo.imdbVotes} votes</b>
                  ) : (
                    <></>
                  )}
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Clock}
                value={fullInfo.runtime}
                notFoundText="Runtime not available"
              >
                <NormalTextSmall>
                  <b>{fullInfo.runtime}</b> long
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.DollarSign}
                value={fullInfo.boxOffice}
                notFoundText="Box office not available"
              >
                <NormalTextSmall>
                  <b>{fullInfo.boxOffice}</b> in Box Office
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Briefcase}
                value={fullInfo.productionCompany}
                notFoundText="Producer not available"
              >
                <NormalTextSmall>
                  Produced by <b>{addAnd(fullInfo.productionCompany)}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Flag}
                value={fullInfo.country}
                notFoundText="Country not available"
              >
                <NormalTextSmall>
                  Produced in <b>{addAnd(fullInfo.country)}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Globe}
                value={fullInfo.language}
                notFoundText="Language not found"
              >
                <NormalTextSmall>
                  Spoken in <b>{addAnd(fullInfo.language)}</b>
                </NormalTextSmall>
              </MovieFact>
              <MovieFact
                Icon={FeatherIcons.Layers}
                value={fullInfo.genre}
                notFoundText="No genres found"
              >
                <NormalTextSmall>
                  Genre
                  {
                    // Make "Genre" plural if the length is greater than one
                    fullInfo.genre && fullInfo.genre.split(",").length > 1
                      ? "s"
                      : ""
                  }
                  : <b>{addAnd(fullInfo.genre)}</b>
                </NormalTextSmall>
              </MovieFact>
            </FactsWrapper>
          </FullHorizontalWrapper>
        </Popup>
      </PopupWrapper>
    </PopupContainer>
  ) : (
    <></>
  );
};

export default MovieInfoPopup;
