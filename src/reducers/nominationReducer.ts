import { NominationsStore, ModifiedOrder } from "components/Nominations";
import { Movie } from "lib/movieModel";

export const nominationsInitialState = {
  modifiedOrder: [],
  nominations: {},
  nominatedDisabled: false,
};

interface NominationsState {
  // List of reorderings
  modifiedOrder: ModifiedOrder;
  // Object of movieid to movie for selected objects
  nominations: NominationsStore;
  nominatedDisabled: boolean;
}

export enum NominationActionTypes {
  ADD = 1,
  REMOVE = 2,
}

type NominationsAction =
  | { type: NominationActionTypes.ADD; movie: Movie }
  | { type: NominationActionTypes.REMOVE; movieId: string };

const nominationReducer = (
  state: NominationsState,
  action: NominationsAction
  // eslint-disable-next-line consistent-return
): NominationsState => {
  switch (action.type) {
    case NominationActionTypes.ADD:
      return {
        // Add this element to the end of the list
        modifiedOrder: [
          ...state.modifiedOrder,
          [action.movie.id, state.modifiedOrder.length],
        ],
        nominations: { ...state.nominations, [action.movie.id]: action.movie },
        // n - 1 length because an element is being added
        nominatedDisabled: state.modifiedOrder.length >= 4,
      };
    case NominationActionTypes.REMOVE: {
      const idIdx = state.modifiedOrder.findIndex(
        ([dbId]) => action.movieId === dbId
      );
      const removedIdx = state.modifiedOrder[idIdx][1];

      // Copy the nominations
      const newNominations = { ...state.nominations };
      // And remove the element
      delete newNominations[action.movieId];

      const newModifiedOrder = state.modifiedOrder
        .filter(([dbId]) => dbId !== action.movieId)
        .map(
          ([dbId, idx]) =>
            [dbId, idx > removedIdx ? idx - 1 : idx] as [string, number]
        );

      return {
        modifiedOrder: newModifiedOrder,
        nominations: newNominations,
        nominatedDisabled: newModifiedOrder.length >= 5,
      };
    }
    // All cases specified
  }
};
export default nominationReducer;
