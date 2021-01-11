import React, { useReducer, useState, useEffect } from "react";

import { CenteredWrapper } from "components/Wrappers";
import { NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import AnimatedElement from "components/AnimatedElement";
import NotificationCenter from "components/Notifications";
import MovieInfoPopup from "components/MovieInfoPopup";
import PageChanger from "components/PageChanger";
import Header from "components/Header";
import SearchResultLayout from "components/SearchResultLayout";

import useSearch from "hooks/useSearch";
import { usePersistedReducer } from "hooks/usePersisted";

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
    searchState.pageNumber,
    (loading) => {
      searchDispatch({ type: SearchActionTypes.SET_LOADING, loading });
    }
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

  const [nominations, nominationsDispatch] = usePersistedReducer(
    nominationReducer,
    nominationsInitialState,
    "nominationsObj"
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
        visible={showDetails}
        onFade={() => setDetails(null)}
        onClose={() => setShowDetails(false)}
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
      <Header />
      <SearchBar
        setQuery={(q: string) => {
          searchDispatch({ type: SearchActionTypes.SET_QUERY, query: q });
        }}
        query={searchState.query}
      />
      <AnimatedElement
        height="35px"
        visible={!isOk(searchResults)}
        style={{ zIndex: 0 }}
      >
        <NormalText>
          {!isOk(searchResults) ? searchResults : prevErr}
        </NormalText>
      </AnimatedElement>
      <AnimatedElement
        height="35px"
        visible={isOk(searchResults) && searchResults[0].length !== 0}
        style={{ zIndex: 1 }}
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
      <SearchResultLayout
        nominations={nominations}
        nominationsDispatch={nominationsDispatch}
        searchResults={searchResults}
        displayMovieInfo={displayMovieInfo}
      />
    </CenteredWrapper>
  );
};

export default IndexPage;
