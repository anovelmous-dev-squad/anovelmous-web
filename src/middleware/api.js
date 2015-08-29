/*
  Design adapted from @gaearon's Redux example: "real-world"
*/
import { Schema, arrayOf, normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import 'isomorphic-fetch';
import { API_ROOT } from 'constants';

function callApi (endpoint, schema) {
  const fullUrl = (endpoint.indexOf(API_ROOT) === -1)
                  ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl)
    .then(response =>
      response.json().then(json => ({ json, response }))
    ).then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json);
      }

      const camelizedJson = camelizeKeys(json);

      return Object.assign({},
        normalize(camelizedJson, schema)
      );
    });
}

const idField = { idAttribute: 'clientId' };

const contributorSchema = new Schema('contributors', idField);
const guildSchema = new Schema('guilds', idField);
const novelSchema = new Schema('novels', idField);
const chapterSchema = new Schema('chapters', idField);
const tokenSchema = new Schema('tokens', idField);
const novelTokenSchema = new Schema('novelTokens', idField);
const formattedNovelTokenSchema = new Schema('formattedNovelTokens', idField);
const voteSchema = new Schema('votes', idField);


export const Schemas = {
  CONTRIBUTOR: contributorSchema,
  CONTRIBUTOR_ARRAY: arrayOf(contributorSchema),
  GUILD: guildSchema,
  GUILD_ARRAY: arrayOf(guildSchema),
  NOVEL: novelSchema,
  NOVEL_ARRAY: arrayOf(novelSchema),
  CHAPTER: chapterSchema,
  CHAPTER_ARRAY: arrayOf(chapterSchema),
  TOKEN: tokenSchema,
  TOKEN_ARRAY: arrayOf(tokenSchema),
  NOVEL_TOKEN: novelTokenSchema,
  NOVEL_TOKEN_ARRAY: arrayOf(novelTokenSchema),
  FORMATTED_NOVEL_TOKEN: formattedNovelTokenSchema,
  FORMATTED_NOVEL_TOKEN_ARRAY: arrayOf(formattedNovelTokenSchema),
  VOTE: voteSchema,
  VOTE_ARRAY: arrayOf(voteSchema)
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = Symbol('Call API');

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];

  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { schema, types } = callAPI;

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!schema) {
    throw new Error('Specify one of the exported Schemas.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  function actionWith (data) {
    const finalAction = Object.assign({}, action, data);

    delete finalAction[CALL_API];
    return finalAction;
  }

  const [requestType, successType, failureType] = types;

  next(actionWith({ type: requestType }));

  return callApi(endpoint, schema).then(
    response => next(actionWith({
      response,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  );
};
