import React, {
  ReactNode,
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
} from "react";
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

const PopupContainer = styled.div`
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
`;

const PopupBackground = styled(animated.div)`
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);

  position: absolute;

  margin: 0;
  padding: 0;

  top: 0;
  left: 0;

  width: 100vw;
  height: 100vh;
`;

const Popup = styled(animated.div)`
  width: fit-content;
  height: fit-content;
  max-height: 80vh;
  max-width: 1000px;

  position: relative;

  margin: 0;
  padding: 30px;

  background-color: ${(props) => props.theme.backgroundTwo};

  border-radius: 4px;
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

const CenteredHorizontalWrapper = styled(HorizontalWrapper)`
  margin-bottom: 10px;
`;

const MovieHeading = styled(MediumHeading)`
  margin-right: 10px;
  margin-bottom: 0px;
  margin-top: 10px;
`;

const MovieInfoPopup = ({
  fullInfo,
  visible,
  onClose,
  onHide,
  onNominate,
  onRemove,
  nominated,
}: {
  fullInfo: FullMovie | null;
  onHide: () => void;
  visible: boolean;
  onClose: () => void;
  onNominate: () => void;
  onRemove: () => void;
  nominated: boolean;
}) => {
  const [display, setDisplay] = useState("none");

  useEffect(() => {
    // Clear previous movie so that the image doesn't flash
    if (display === "none" && !visible) {
      onHide();
    }
  }, [display]);

  const popupStyle = useSpring({
    opacity: visible ? 1 : 0,
    transform: visible ? "translate3d(0, 0, 0)" : "translate3d(0, -100vh, 0)",
    onRest: () => {
      setDisplay((oldDisplay) => (visible ? oldDisplay : "none"));
    },
  });

  const backgroundStyle = useSpring({
    opacity: visible ? 1 : 0,
    onStart: () => {
      setDisplay((oldDisplay) => (visible ? "flex" : oldDisplay));
    },
  });

  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(1);

  useLayoutEffect(() => {
    if (ref && ref.current) {
      setHeight(ref.current.offsetHeight + 20);
    }
  });

  // Maintain movie aspect ratio
  const imageWidth = height / 1.583;

  // Again, the `as any` casts are needed because of a bug in react spring:
  // https://github.com/react-spring/react-spring/issues/1102
  return fullInfo ? (
    <PopupContainer style={{ display }}>
      <PopupBackground
        style={{ ...backgroundStyle } as any}
        onClick={onClose}
      />
      <Popup style={popupStyle as any}>
        <FullHorizontalWrapper>
          <MovieInfoImage
            url={getLinkHighRes(fullInfo.posterUrl)}
            fallbackTitle={fullInfo.title}
            iconSize={64}
            style={{
              minWidth: imageWidth,
              width: imageWidth,
              maxWidth: imageWidth,

              minHeight: height,
              height,
              maxHeight: height,
            }}
          />
          <FactsWrapper ref={ref}>
            <CenteredHorizontalWrapper>
              <MovieHeading>{fullInfo.title}</MovieHeading>
              {nominated ? (
                <BigButton onClick={onRemove}>Remove</BigButton>
              ) : (
                <BigButton onClick={onNominate}>Nominate</BigButton>
              )}
            </CenteredHorizontalWrapper>
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
                <b>Synopsis</b>:{fullInfo.plot}
              </NormalTextSmall>
            </MovieFact>
            <MovieFact
              Icon={FeatherIcons.Film}
              value={fullInfo.ageRating}
              notFoundText="Not rated"
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
        <RemoveButton onClick={onClose} marginTop={21} marginRight={16}>
          <FeatherIcons.X size={23} color="black" />
        </RemoveButton>
      </Popup>
    </PopupContainer>
  ) : (
    <></>
  );
};

export default MovieInfoPopup;
