import React, { useReducer, useState, useEffect } from "react";

import { CenteredWrapper, HorizontalWrapper } from "components/Wrappers";
import { LargeHeading, NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import MovieResults from "components/MovieResults";
import AnimatedElement from "components/AnimatedElement";
import Nominations from "components/Nominations";
import NotificationCenter from "components/Notifications";
import MovieInfoPopup from "components/MovieInfoPopup";
import PageChanger from "components/PageChanger";

import useSearch from "hooks/useSearch";

import { isOk } from "lib/result";
import { getFullMovie } from "lib/api";
import { FullMovie, Movie } from "lib/movieModel";

import nominationReducer, {
  NominationActionTypes,
  nominationsInitialState,
} from "reducers/nominationReducer";
import notificationReducer, {
  NotificationActionTypes,
  notificationInitialState,
} from "reducers/notificationReducer";
import searchReducer, {
  SearchActionTypes,
  searchInitialState,
} from "reducers/searchReducer";

const IndexPage = () => {
  const [searchState, searchDispatch] = useReducer(
    searchReducer,
    searchInitialState
  );

  const searchResults = useSearch(
    searchState.query,
    searchState.dateFilter,
    searchState.pageNumber
  );

  // For smoother error message fades
  // (edge case during query clear)
  const [prevErr, setPrevErr] = useState<string>("");

  useEffect(() => {
    if (searchState.query !== "") {
      if (!isOk(searchResults)) {
        setPrevErr(searchResults);
      }
    }
  }, [searchResults, searchState.query]);

  const [nominations, nominationsDispatch] = useReducer(
    nominationReducer,
    nominationsInitialState
  );

  const [notifications, notificationsDispatch] = useReducer(
    notificationReducer,
    notificationInitialState
  );

  const [details, setDetails] = useState<FullMovie | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const displayMovieInfo = (movie: Movie) => {
    (async () => {
      if (!details || details.id !== movie.id) {
        // Only fetch the movie if it wasn't the most recently fetched
        setDetails(await getFullMovie(movie.id));
      }
      setShowDetails(true);
    })();
  };

  useEffect(() => {
    if (nominations.nominatedDisabled) {
      // Add a notification
      notificationsDispatch({
        type: NotificationActionTypes.ADD,
        notification: {
          message:
            "You've picked 5 nominations, thanks! Feel free to make make changes to your nominations or rearrange them.",
          // Make notification last for 5 seconds
          duration: 5000,
        },
      });
    }
  }, [nominations.nominatedDisabled]);

  // If set to true, we render the emoji
  // If false, we render the svg logo
  // We use this for a fallback for the logo, so it always shows a trophy (of some sort)
  const [alt, setAlt] = useState(true);

  return (
    <CenteredWrapper>
      <NotificationCenter
        notifications={notifications.notifications}
        removeNotification={(idx: number) => {
          notificationsDispatch({
            type: NotificationActionTypes.REMOVE,
            notificationId: idx,
          });
        }}
      />
      <MovieInfoPopup
        fullInfo={details}
        onHide={() => {
          // Remove details
          setDetails(null);
        }}
        visible={showDetails}
        onClose={() => {
          // Hide panel
          setShowDetails(false);
        }}
        onNominate={() => {
          nominationsDispatch({
            type: NominationActionTypes.ADD,
            movie: details!,
          });
        }}
        onRemove={() => {
          nominationsDispatch({
            type: NominationActionTypes.REMOVE,
            movieId: details!.id,
          });
        }}
        nominated={
          details !== null &&
          Object.prototype.hasOwnProperty.call(
            nominations.nominations,
            details.id
          )
        }
      />
      <HorizontalWrapper style={{ marginTop: "50px" }}>
        {alt ? (
          <LargeHeading>
            <span role="img" aria-label="Trophy Logo">
              🏆
            </span>
          </LargeHeading>
        ) : (
          <></>
        )}
        <img
          alt="Logo"
          onError={() => setAlt(true)}
          onLoad={() => setAlt(false)}
          style={{ display: alt ? "none" : "block" }}
          src="/logo192.png"
          width={62}
          height={62}
        />
        <LargeHeading style={{ marginLeft: "25px" }}>The Shoppies</LargeHeading>
      </HorizontalWrapper>
      <NormalText>Nominate your top 5 movies for the Shopies award!</NormalText>
      <SearchBar
        setQuery={(q: string) => {
          searchDispatch({ type: SearchActionTypes.SET_QUERY, query: q });
        }}
        query={searchState.query}
      />
      <AnimatedElement height="35px" visible={!isOk(searchResults)}>
        <NormalText>
          {!isOk(searchResults) ? searchResults : prevErr}
        </NormalText>
      </AnimatedElement>
      <AnimatedElement
        height="35px"
        visible={isOk(searchResults) && searchResults[0].length !== 0}
      >
        <PageChanger
          onNextPage={() => {
            searchDispatch({ type: SearchActionTypes.NEXT_PAGE });
          }}
          onPreviousPage={() => {
            searchDispatch({ type: SearchActionTypes.PREVIOUS_PAGE });
          }}
          currentPage={searchState.pageNumber}
          totalPages={!isOk(searchResults) ? 0 : searchResults[1]}
        />
      </AnimatedElement>
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
        />
      </HorizontalWrapper>
    </CenteredWrapper>
  );
};

export default IndexPage;
