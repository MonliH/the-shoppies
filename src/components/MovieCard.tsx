import React, { CSSProperties, useState, ReactNode } from "react";
import { animated } from "react-spring";
import styled from "styled-components";
import { CameraOff } from "react-feather";

import { VerticalWrapper, HorizontalWrapper } from "components/Wrappers";
import { SmallHeading, NormalText } from "components/Text";
import { AnimatedStyledPadding } from "components/Widget";

import { Movie } from "lib/movieModel";
import Without from "lib/without";

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
  width: ${cardDimensions.width}px;
  height: ${cardDimensions.height}px;
  padding: 15px !important;
  display: flex;
  align-items: center;
  margin: 0;
  overflow: hidden;
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
  max-width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  otherProps?: Without<React.ComponentProps<typeof animated.div>, "css">;
  headingStyle?: React.CSSProperties;
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

export const MovieCard = ({
  movie,
  children,
  cursor,
  otherProps,
  headingStyle,
}: MovieCardProps) => {
  return (
    <MoviePadding
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
      style={{ cursor, ...otherProps?.style } as any} // Note: a bug in react spring
    >
      <MovieHW>
        <MovieCardImage
          url={movie.posterUrl}
          fallbackTitle={movie.title}
          iconSize={20}
        />
        <MovieVW>
          <MovieHeading style={headingStyle}>{movie.title}</MovieHeading>
          <DateText>Released in {movie.releaseYear}</DateText>
          {children}
        </MovieVW>
      </MovieHW>
    </MoviePadding>
  );
};

export default MovieCard;
