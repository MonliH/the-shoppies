import React, { useState, useEffect } from "react";

import { CenteredWrapper, HorizontalWrapper } from "components/Wrappers";
import { LargeHeading, NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import MovieResults from "components/MovieResults";
import AnimatedElement from "components/AnimatedElement";
import Nominations, {
  NominationsStore,
  ModifiedOrder,
} from "components/Nominations";
import NotificationCenter, {
  NotificationValue,
} from "components/Notifications";

import useSearch from "hooks/useSearch";

import { isOk } from "lib/result";
import { Movie } from "lib/movieModel";

const IndexPage = () => {
  const [query, set_query, search_results] = useSearch();

  // For smoother error message fades
  // (edge case during query clear)
  const [prev_err, set_prev_err] = useState<string>("");

  useEffect(() => {
    if (query !== "") {
      if (!isOk(search_results)) {
        set_prev_err(search_results);
      }
    }
  }, [search_results, query]);

  // If set to true, we render the emoji
  // If false, we render the svg logo
  // We use this for a fallback for the logo, so it always
  // shows a trophy of some sort
  const [alt, setAlt] = useState(true);

  const displayMovieInfo = () => {};

  const [notifications, setNotifications] = useState<Array<NotificationValue>>(
    []
  );
  const [notificationIdx, setNotificationIdx] = useState(0);

  // List of reorderings
  const [modifiedOrder, setModifiedOrder] = useState<ModifiedOrder>([]);
  // Object of movieid to movie for selected objects
  const [nominations, setNominated] = useState<NominationsStore>({});
  const [nominatedDisabled, setNominatedDisabled] = useState(false);

  useEffect(() => {
    if (modifiedOrder.length >= 5) {
      setNominatedDisabled(true);
      setNotifications((notifications) => {
        setNotificationIdx((nIdx) => nIdx + 1);
        return [
          ...notifications,
          {
            id: notificationIdx,
            message:
              "You've picked 5 nominations, thanks! Feel free to make make changes to your nominations or rearrange them.",
            // Make notification last for 5 seconds
            duration: 5000,
          },
        ];
      });
    } else {
      setNominatedDisabled(false);
    }
  }, [nominations]);

  return (
    <CenteredWrapper>
      <NotificationCenter
        notifications={notifications}
        setNotifications={setNotifications}
      />
      <HorizontalWrapper style={{ marginTop: "50px" }}>
        {alt ? <LargeHeading>🏆</LargeHeading> : <></>}
        <img
          alt="Logo"
          onError={() => setAlt(false)}
          onLoad={() => setAlt(false)}
          style={{ display: alt ? "none" : "block" }}
          src="/logo192.png"
          width={62}
          height={62}
        />
        <LargeHeading style={{ marginLeft: "25px" }}>The Shoppies</LargeHeading>
      </HorizontalWrapper>
      <NormalText>Nominate your top 5 movies for the Shopies award!</NormalText>
      <SearchBar set_query={set_query} query={query} />
      <AnimatedElement height="35px" visible={!isOk(search_results)}>
        <NormalText>
          {!isOk(search_results) ? search_results : prev_err}
        </NormalText>
      </AnimatedElement>
      <HorizontalWrapper>
        <MovieResults
          movies={isOk(search_results) ? search_results : []}
          movieOnClick={displayMovieInfo}
          movieOnNominate={(movie: Movie) => {
            // Add this element to the end of the list
            setModifiedOrder(
              (modifiedOrd) => [...modifiedOrd, [movie.id, modifiedOrd.length]],
            );
            setNominated((nom) => ({
              ...nom,
              [movie.id]: movie,
            }));
          }}
          nominated={nominations}
          nominatedDisabled={nominatedDisabled}
        />
        <Nominations
          movieOnClick={displayMovieInfo}
          removeOnClick={({ id }) => {
            // Remove that value
            setModifiedOrder((modOrd) => {
              const idIdx = modOrd.findIndex(([dbId]) => id === dbId);
              const removedIdx = modOrd[idIdx][1];

              return modOrd
                .filter(([dbId]) => dbId !== id)
                .map(([dbId, idx]) => [dbId, idx > removedIdx ? idx - 1 : idx]);
            });

            setNominated((nom) => {
              let newNominated = { ...nom };
              delete newNominated[id];
              return newNominated;
            });
          }}
          modifiedOrder={modifiedOrder}
          setModifiedOrder={setModifiedOrder}
          nominations={nominations}
        />
      </HorizontalWrapper>
    </CenteredWrapper>
  );
};

export default IndexPage;
