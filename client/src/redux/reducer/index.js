/** @format */

//Estado global inicial
const initialState = {
  allClothing: [],
  detail: [],
  filtered: [],
  added: [],
  notFound: "",
  cart: [],
  user: [],

  /* AUTH */
  status: "not-authenticated", // 'checking', 'not-authenticated', 'authenticated'
  uid: null,
  email: null,
  displayName: null,
  photoURL: null,
  errorMessage: null,
};

function rootReducer(state = initialState, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        status: "authenticated",
        uid: action.payload.uid,
        email: action.payload.email,
        displayName: action.payload.displayName,
        photoURL: action.payload.photoURL,
        errorMessage: null,
      };

    case "LOGOUT":
      return {
        ...state,
        status: "not-authenticated",
        uid: null,
        email: null,
        displayName: null,
        photoURL: null,
        errorMessage: action.payload?.errorMessage,
      };

    case "CHECKING_CREDENTIALS":
      return {
        ...state,
        status: "checking",
      };

    case "GET_CLOTHING":
      return {
        ...state,
        allClothing: action.payload,
        notFound: "",
      };

    case "GET_CLOTHING_DETAIL":
      return {
        ...state,
        detail: action.payload[0],
      };

      case 'POST_REVIEW':
        return {
            ...state,
            review: action.payload
        }


    case "SET_ORDER_PRICE":
      let orderByPrice = [...state.allClothing];
      orderByPrice = orderByPrice.sort((a, b) => {
        if (a.price < b.price) {
          return action.payload === "low" ? -1 : 1;
        }
        if (a.price > b.price) {
          return action.payload === "top" ? -1 : 1;
        }
        return 0;
      });
      return {
        ...state,
        allClothing: orderByPrice,
      };

    case "SEARCH_CLOTHING_NAME":
      return {
        ...state,
        allClothing: action.payload,
      };

    case "ADD_CLOTHING":
      return {
        ...state,
      };

    case "CLEAR_STATE":
      return {
        ...state,
        allClothing: [],
        filtered: [],
        detail: [],
      };

    case "CHECKING_AUTH":
      return {
        ...state,
        status: "authenticated",
        email: action.payload.email,
        displayName: action.payload.username,
        errorMessage: null,
      };

    case "GET_USER":
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
}

export default rootReducer;
