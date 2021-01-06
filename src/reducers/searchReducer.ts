export const searchInitialState = {
  query: "",
  dateFilter: "",
  pageNumber: 1,
};

interface SearchState {
  query: string;
  dateFilter: string;
  pageNumber: number;
}

export enum SearchActionTypes {
  SET_QUERY = 0,
  SET_DATE_FILTER = 1,
  NEXT_PAGE = 2,
  PREVIOUS_PAGE = 3,
}

type SearchAction =
  | { type: SearchActionTypes.SET_QUERY; query: string }
  | { type: SearchActionTypes.SET_DATE_FILTER; dateFilter: string }
  | { type: SearchActionTypes.NEXT_PAGE }
  | { type: SearchActionTypes.PREVIOUS_PAGE };

const nominationReducer = (
  state: SearchState,
  action: SearchAction
  // eslint-disable-next-line consistent-return
): SearchState => {
  switch (action.type) {
    case SearchActionTypes.SET_QUERY:
      return { ...state, query: action.query };
    case SearchActionTypes.SET_DATE_FILTER:
      return { ...state, dateFilter: action.dateFilter };
    case SearchActionTypes.NEXT_PAGE:
      return { ...state, pageNumber: state.pageNumber + 1 };
    case SearchActionTypes.PREVIOUS_PAGE:
      return { ...state, pageNumber: state.pageNumber - 1 };
    // All cases specified
  }
};
export default nominationReducer;
