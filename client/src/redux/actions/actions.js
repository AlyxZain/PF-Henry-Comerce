/** @format */

import axios from 'axios';
import { FaBullseye } from 'react-icons/fa';
const LOCAL_HOST = 'http://localhost:3001';

export function getClothing(allFilters) {
  return async function (dispatch) {
    try {
      axios
        .get(`${LOCAL_HOST}/api/clothing?${allFilters}`)
        .then((response) => {
          return dispatch({
            type: 'GET_CLOTHING',
            payload: response.data,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      const errorMessage = { error: error.message };
      console.log(
        'Se a detectado un error en actions.js -- Linea 20 --',
        errorMessage
      );
      return dispatch({
        type: 'GET_CLOTHING',
        payload: errorMessage,
      });
    }
    // try {
    //   axios
    //     .get(`https://data.mongodb-api.com/app/data-oovux/endpoint/clothes`, {
    //       headers: {
    //         'api-key': `NXL8cE2iVb8gFma3cGU2JZbWrkTnHL9P0xegtO0RPKz7mfmh9Yptejsl1oVoZNBd`,
    //       },
    //     })
    //     .then((response) => {
    //       return dispatch({ type: 'GET_CLOTHING', payload: response.data });
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // } catch (error) {
    //   const errorMessage = { error: error.message };
    //   console.log(
    //     'Se a detectado un error en actions.js -- Linea 20 --',
    //     errorMessage
    //   );
    //   return dispatch({
    //     type: 'GET_CLOTHING',
    //     payload: errorMessage,
    //   });
    // }
  };
}

export function addClothing(payload) {
  return async function (dispatch) {
    try {
      var info = await axios.post(`${LOCAL_HOST}/api/clothing/add`, payload);
      return dispatch({
        type: 'ADD_CLOTHING',
        info,
      });
    } catch (error) {
      const errorMessage = { error: error.message };
      console.log(errorMessage);
    }
  };
}

export function getClothingDetail(name) {
  return async function (dispatch) {
    try {
      const cloth = await axios.get(`${LOCAL_HOST}/api/clothing/items/${name}`);
      return dispatch({
        type: 'GET_CLOTHING_DETAIL',
        payload: cloth.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}

export function getClothingByName(name) {
  return async function (dispatch) {
    try {
      const cloth = await axios.get(
        `${LOCAL_HOST}/api/clothing/search?name=${name}`
      );
      return dispatch({
        type: 'SEARCH_CLOTHING_NAME',
        payload: cloth.data,
      });
    } catch (error) {
      console.log(error);
      return alert('Clothing was not found');
    }
  };
}

export function setOrderByPrice(price) {
  return {
    type: 'SET_ORDER_PRICE',
    payload: price,
  };
}

export function clearState() {
  return (dispatch) => {
    dispatch({ type: 'CLEAR_STATE' });
  };
}

/*  AUTH  */

import {
  loginWithEmailPassword,
  registerUserWithEmailPassword,
  singInWithGoogle,
  logoutFirebase,
  singInWithGithub,
} from '../../firebase/providers';

export const checkingAuthentication = () => {
  return async (dispatch) => {
    localStorage.setItem('authenticated', false);
    dispatch({
      type: 'CHECKING_CREDENTIALS',
    });
  };
};

export const startGithubSignIn = () => {
  return async (dispatch) => {
    dispatch({
      type: 'CHECKING_CREDENTIALS',
    });

    const result = await singInWithGithub();
    if (result.ok === false) {
      localStorage.setItem('authenticated', false);
      return dispatch({
        type: 'LOGOUT',
        payload: result.errorMessage,
      });
    }
    console.log(result);
    const { email, displayName } = result;
    let admin = false;

    const password = email.toLowerCase();
    const creado = await axios.post(`${LOCAL_HOST}/api/user/register`, {
      username: displayName,
      email: email.toLowerCase(),
      password,
      country: 'argentina',
      isAdmin: admin,
    });

    console.log('usuario creado', creado);

    const token = creado.data.token;

    const existe = await axios.post(`${LOCAL_HOST}/api/user/login`, {
      email: email.toLowerCase(),
      password,
    });

    console.log('existe', existe);

    if (existe.status === 200) {
      const add = await axios.get(
        `${LOCAL_HOST}/api/user/info/${email.toLowerCase()}`,
        {
          headers: { 'x-access-token': `${existe.data.token}` },
        }
      );
      admin = add.data.isAdmin;
      localStorage.setItem(
        'authenticated',
        JSON.stringify({
          authenticated: true,
          isAdmin: admin,
          token: token,
        })
      );
    }

    dispatch({
      type: 'LOGIN',
      payload: result,
    });
  };
};

export const startGoogleSignIn = () => {
  return async (dispatch) => {
    dispatch({
      type: 'CHECKING_CREDENTIALS',
    });

    const result = await singInWithGoogle();
    if (result.ok === false) {
      localStorage.setItem('authenticated', false);
      return dispatch({
        type: 'LOGOUT',
        payload: result.errorMessage,
      });
    }

    const { email, displayName } = result;

    console.log(result);
    let admin = false;

    const password = email.toLowerCase();
    const creado = await axios.post(`${LOCAL_HOST}/api/user/register`, {
      username: displayName,
      email: email.toLowerCase(),
      password,
      country: 'argentina',
      isAdmin: admin,
    });

    console.log('usuario creado', creado);

    const token = creado.data.token;

    const existe = await axios.post(`${LOCAL_HOST}/api/user/login`, {
      email: email.toLowerCase(),
      password,
    });

    console.log('existe', existe);
    // try {
    //   const existe = await axios.get(`${LOCAL_HOST}/api/user/info/${email}`);
    //   const { data } = existe;
    //   admin = data.isAdmin;
    //   console.log('existe', existe);

    //   if (email === data.email) {
    //     console.log('el usuario ya existe');
    //   } else {
    //     const creado = await axios.post(`${LOCAL_HOST}/api/user/register`, {
    //       username: result.displayName,
    //       email: result.email,
    //       password: result.uid,
    //       country: 'argentina',
    //       isAdmin: false,
    //     });

    //     console.log('usuario creado', creado);
    //   }
    // } catch (error) {
    //   console.log('error', error);
    // }

    if (existe.status === 200) {
      const add = await axios.get(
        `${LOCAL_HOST}/api/user/info/${email.toLowerCase()}`,
        {
          headers: { 'x-access-token': `${existe.data.token}` },
        }
      );
      admin = add.data.isAdmin;
      localStorage.setItem(
        'authenticated',
        JSON.stringify({
          authenticated: true,
          isAdmin: admin,
          token: token,
        })
      );
    }

    dispatch({
      type: 'LOGIN',
      payload: result,
    });
  };
};

export const startCreatingUserWithEmailPassword = ({
  email,
  password,
  displayName,
}) => {
  return async (dispatch) => {
    dispatch({
      type: 'CHECKING_CREDENTIALS',
    });

    const result = await registerUserWithEmailPassword({
      email,
      password,
      displayName,
    });

    console.log('usuario a crear', result);
    if (result.ok === false) {
      localStorage.setItem('authenticated', false);
      return dispatch({
        type: 'LOGOUT',
        payload: result.errorMessage,
      });
    }

    const creado = await axios.post(`${LOCAL_HOST}/api/user/register`, {
      username: email.toLowerCase(),
      email: email.toLowerCase(),
      password,
      country: 'argentina',
      isAdmin: false,
    });
    console.log('usuario creado', creado);

    // }

    localStorage.setItem(
      'authenticated',
      JSON.stringify({
        authenticated: true,
        isAdmin: false,
      })
    );

    dispatch({
      type: 'LOGIN',
      payload: result,
    });
  };
};

export const startLoginWithEmailPassword = ({ email, password }) => {
  return async (dispatch) => {
    dispatch({
      type: 'CHECKING_CREDENTIALS',
    });

    const result = await loginWithEmailPassword({ email, password });
    console.log('action login', result);
    if (result.ok === false) {
      localStorage.setItem('authenticated', false);
      return dispatch({
        type: 'LOGOUT',
        payload: result.errorMessage,
      });
    }

    const existe = await axios.post(`${LOCAL_HOST}/api/user/login`, {
      email: email.toLowerCase(),
      password,
    });

    console.log('existe', existe);
    if (existe.status === 200) {
      const add = await axios.get(
        `${LOCAL_HOST}/api/user/info/${email.toLowerCase()}`,
        {
          headers: { 'x-access-token': `${existe.data.token}` },
        }
      );

      const admin = add.data.isAdmin;
      localStorage.setItem(
        'authenticated',
        JSON.stringify({
          authenticated: true,
          isAdmin: admin,
          token: existe.data.token,
        })
      );
      return dispatch({
        type: 'LOGIN',
        payload: result,
      });
    }
  };
};

export const startLogout = (result) => {
  return async (dispatch) => {
    await logoutFirebase();

    dispatch({
      type: 'LOGOUT',
      payload: result,
    });
  };
};

export const checkAuth = (result) => {
  return async (dispatch) => {
    dispatch({
      type: 'CHECKING_AUTH',
      payload: result,
    });
  };
};

export function getUser(email) {
  return async function (dispatch) {
    try {
      const user = await axios.get(`${LOCAL_HOST}/api/user/info/${email}`);
      return dispatch({
        type: 'GET_USER',
        payload: user.data,
      });
    } catch (error) {
      console.log(error);
    }
  };
}
