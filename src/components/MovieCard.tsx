import React, { CSSProperties, useState, ReactNode } from "react";
import { useSpring } from "react-spring";
import styled from "styled-components";
import { CameraOff } from "react-feather";

import { VerticalWrapper, HorizontalWrapper } from "components/Wrappers";
import { SmallHeading, NormalText } from "components/Text";
import { AnimatedStyledPadding } from "components/Widget";

import { Movie } from "lib/movieModel";

// Card width
export const cardDimensions = {
  width: 300,
  height: 120,

  // Left right margin
  LRMargin: 20,
  // Top bottom margin
  TBMargin: 20,
};

const MovieImg = styled.img`
  border-radius: 3px;
  object-fit: cover;
`;

const MovieFallback = styled(MovieImg).attrs({ as: "div" })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #efefef;
`;

const MoviePadding = styled(AnimatedStyledPadding)`
  position: relative;
  width: ${cardDimensions.width}px !important;
  height: ${cardDimensions.height}px !important;
  padding: 15px !important;
  display: flex;
  align-items: center;
  margin: 0;
  &:hover {
    cursor: pointer;
  }
`;
const MovieHW = styled(HorizontalWrapper)`
  align-items: center;
`;

const MovieVW = styled(VerticalWrapper)`
  margin-left: 10px;
`;

const DateText = styled(NormalText)`
  margin: 0;
  font-size: 15px;
`;

const MovieHeading = styled(SmallHeading)`
  margin: 0;
  margin-bottom: 3px;
  font-size: 17px;
`;

const MovieImageFallback = ({
  title,
  className,
  iconSize,
  style,
}: {
  title: string;
  className?: string;
  iconSize: number;
  style?: CSSProperties;
}) => (
  <MovieFallback className={className} style={style}>
    <SmallHeading style={{ fontSize: "inherit" }}>
      {
        // Put initials of movie
        title
          .split(" ")
          .slice(0, 3) // Up to three initials
          .map((n) => n[0].toUpperCase())
          .join("")
      }
    </SmallHeading>
    <CameraOff size={iconSize} color="#363636" />
  </MovieFallback>
);

export interface MovieInteraction {
  movieOnInfo: (movie: Movie) => void;
}

interface MovieCardProps {
  movie: Movie;
  cursor?: string;
  children?: ReactNode;
}

export const MovieImage = ({
  url,
  fallbackTitle,
  iconSize,
  className,
  style,
}: {
  url?: string;
  fallbackTitle: string;
  iconSize: number;
  className?: string;
  style?: CSSProperties;
}) => {
  const [isErr, setIsErr] = useState(false);
  return isErr || !url ? (
    <MovieImageFallback
      title={fallbackTitle}
      className={className}
      iconSize={iconSize}
      style={style}
    />
  ) : (
    <MovieImg
      alt="Movie Poster"
      onError={() => {
        setIsErr(true);
      }}
      src={url}
      className={className}
      style={style}
    />
  );
};

const MovieCardImage = styled(MovieImage)`
  width: 60px;
  height: 95px;
  min-width: 60px;
  min-height: 95px;
  font-size: 18px;
`;

export const MovieCard = ({ movie, children, cursor }: MovieCardProps) => {
  const [hover, setHover] = useState(false);

  const style = useSpring({
    boxShadow: hover ? "5px 3px 10px 5px #F2F2F2" : "5px 3px 7px 1px #F2F2F2",
    scale: hover ? 1.005 : 1,
  });

  return (
    <MoviePadding
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ ...style, cursor: cursor } as any} // Note: a bug in react spring, see MovieResults component for more info
    >
      <MovieHW>
        <MovieCardImage
          url={movie.posterUrl}
          fallbackTitle={movie.title}
          iconSize={20}
        />
        <MovieVW>
          <MovieHeading>
            {movie.title.length > 40
              ? `${movie.title.slice(0, 30)}...`
              : movie.title}
          </MovieHeading>
          <DateText>Released in {movie.releaseYear}</DateText>
          {children}
        </MovieVW>
      </MovieHW>
    </MoviePadding>
  );
};

export default MovieCard;
