import {
  SET_PROJECT_ID,
  SET_NAME,
  SET_TYPE,
  SET_SOURCE_TYPE,
  ADD_LABEL,
  REMOVE_LABEL,
  ADD_PREPROCESSING_STEP,
  REMOVE_PREPROCESSING_STEP,
  SET_TRAIN_TEST_SPLIT,
  SET_MODEL_PARAMETER,
  SET_TRANSFER_SOURCE,
  ADD_LAYER,
  EDIT_LAYER,
  REMOVE_LAYER,
  SAVE_MODEL_REQUEST,
  SAVE_MODEL_SUCCESS,
  SAVE_MODEL_FAILURE,
  SET_EXPORT_TYPE,
  TEST_MODEL_REQUEST,
  TEST_MODEL_SUCCESS,
  TEST_MODEL_FAILURE,
  UPLOAD_MODEL_REQUEST,
  UPLOAD_MODEL_SUCCESS,
  UPLOAD_MODEL_FAILURE,
  GET_TRAINED_MODELS_REQUEST,
  GET_TRAINED_MODELS_FAILURE,
  GET_TRAINED_MODELS_SUCCESS,
  GET_PROJECT_MODELS_REQUEST,
  GET_PROJECT_MODELS_SUCCESS,
  GET_PROJECT_MODELS_FAILURE,
  DELETE_MODEL_REQUEST,
  DELETE_MODEL_SUCCESS,
  DELETE_MODEL_FAILURE,
  GET_MODEL_REQUEST,
  GET_MODEL_SUCCESS,
  GET_MODEL_FAILURE,
} from '../constants/index'

import FetchApi from '../utils/FetchAPI'


export const setProjectId = id => {
  return {
    type: SET_PROJECT_ID,
    payload: id
  }
}

export const setExportType = exportType => {
  return {
    type: SET_EXPORT_TYPE,
    payload: exportType
  }
}

export const setName = name => {
  return {
    type: SET_NAME,
    payload: name
  }
}

export const setType = type => {
  return {
    type: SET_TYPE,
    payload: type
  }
}

export const setSource = sourceType => {
  return {
    type: SET_SOURCE_TYPE,
    payload: sourceType
  }
}

export const addLabel = (labels, labelToAdd) => {
  if (!labels) {
    labels = [labelToAdd]
  }
  else if (!labels.includes(labelToAdd)) {
    labels.push(labelToAdd)
  }

  return {
    type: ADD_LABEL,
    payload: labels
  }
}

export const removeLabel = (labels, labelToRemove) => {
  labels = labels.filter(label => label !== labelToRemove)

  return {
    type: REMOVE_LABEL,
    payload: labels
  }
}

export const addPreprocessingStep = (steps, stepToAdd) => {
  if (!steps) {
    steps = [stepToAdd]
  }
  else if (steps.filter(step => step.name === stepToAdd.name).length <= 0) {
    steps.push(stepToAdd)
  }

  return {
    type: ADD_PREPROCESSING_STEP,
    payload: steps
  }
}

export const removePreprocessingStep = (steps, stepToRemove) => {
  steps = steps.filter(step => step.name !== stepToRemove)

  return {
    type: REMOVE_PREPROCESSING_STEP,
    payload: steps
  }
}

export const setTrainTestSplit = (field, value) => {
  const payload = {}
  payload[field] = value

  return {
    type: SET_TRAIN_TEST_SPLIT,
    payload
  }
}

export const setModelParameter = (field, value) => {
  const payload = {}
  payload[field] = value

  return {
    type: SET_MODEL_PARAMETER,
    payload
  }
}

export const setTransferLearningSource = value => {
  return {
    type: SET_TRANSFER_SOURCE,
    payload: value
  }
}

export const addLayer = (layers, layer) => {
  if (!layers) {
    layers = [layer]
  } else {
    layers.push(layer)
  }

  return {
    type: ADD_LAYER,
    payload: layers
  }
}

export const editLayer = (layers, index, editedLayer) => {
  layers[index] = editedLayer

  return {
    type: EDIT_LAYER,
    payload: layers
  }
}

export const removeLayer = (layers, layerToRemove) => {
  layers = layers.filter(layer => layer.name !== layerToRemove)

  return {
    type: REMOVE_LAYER,
    payload: layers
  }
}

export const getProjectModels = projectId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/mlclassifier/all/' + projectId)
      .then(res => {
        dispatch(success(res.data.body))
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: GET_PROJECT_MODELS_REQUEST }
  }
  function success(data) {
    return { type: GET_PROJECT_MODELS_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: GET_PROJECT_MODELS_FAILURE, payload: error }
  }
}

export const getModel = modelId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/mlclassifier/' + modelId)
      .then(res => {
        dispatch(success(res.data.body))
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: GET_MODEL_REQUEST }
  }
  function success(data) {
    return { type: GET_MODEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: GET_MODEL_FAILURE, payload: error }
  }
}

export const deleteModel = (modelId, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.delete('/api/v1/mlclassifier/' + modelId, null)
      .then(res => {
        dispatch(success())
        callback()
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: DELETE_MODEL_REQUEST }
  }
  function success() {
    return { type: DELETE_MODEL_SUCCESS }
  }
  function failure(error) {
    return { type: DELETE_MODEL_FAILURE, payload: error }
  }
}

export const createModel = (modelData, callback) => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/mlclassifier', modelData)
      .then(res => {
        dispatch(success(res.data.body.model))
        callback(res.data.body.id)
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: SAVE_MODEL_REQUEST }
  }
  function success(data) {
    return { type: SAVE_MODEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: SAVE_MODEL_FAILURE, payload: error }
  }
}

export const editModel = (modelData, modelId) => {
  return dispatch => {
    dispatch(request())
    FetchApi.put('/api/v1/mlclassifier/' + modelId, modelData)
      .then(res => {
        dispatch(success(res.data.body))
      })
      .catch(err => {
        if (err.response) {
          err.response.data
            ? dispatch(failure(err.response.data.msg))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: SAVE_MODEL_REQUEST }
  }
  function success(data) {
    return { type: SAVE_MODEL_SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: SAVE_MODEL_FAILURE, payload: error }
  }
}

export const testModel = modelData => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/mlclassifier/test', modelData, true)
      .then(res => {
        dispatch(success())
      })
      .catch(err => {
        if (err.response) {
          err.response.message
            ? dispatch(failure(err.response.message))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: TEST_MODEL_REQUEST }
  }
  function success() {
    return { type: TEST_MODEL_SUCCESS }
  }
  function failure(error) {
    return { type: TEST_MODEL_FAILURE, payload: error }
  }
}

export const uploadModel = modelData => {
  return dispatch => {
    dispatch(request())
    FetchApi.post('/api/v1/mlclassifier/upload', modelData, true)
      .then(res => {
        dispatch(success())
      })
      .catch(err => {
        if (err.response) {
          err.response.message
            ? dispatch(failure(err.response.message))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: UPLOAD_MODEL_REQUEST }
  }
  function success() {
    return { type: UPLOAD_MODEL_SUCCESS }
  }
  function failure(error) {
    return { type: UPLOAD_MODEL_FAILURE, payload: error }
  }
}

export const getTraiendModels = projectId => {
  return dispatch => {
    dispatch(request())
    FetchApi.get('/api/v1/mlclassifier/trained/' + projectId, null, true)
      .then(res => {
        dispatch(success())
      })
      .catch(err => {
        if (err.response) {
          err.response.message
            ? dispatch(failure(err.response.message))
            : dispatch(failure(err.response.statusText, null))
        }
      })
  }
  function request() {
    return { type: GET_TRAINED_MODELS_REQUEST }
  }
  function success() {
    return { type: GET_TRAINED_MODELS_SUCCESS }
  }
  function failure(error) {
    return { type: GET_TRAINED_MODELS_FAILURE, payload: error }
  }
}