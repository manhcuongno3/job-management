import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

//Board
//use intercepter for validate (update future)
export const fetchBoardDetailAPI = async boardId => {
  const responnse = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return responnse.data
}

export const updateBoardDetailAPI = async (boardId, updateData) => {
  const responnse = await axios.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  )
  return responnse.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const responnse = await axios.post(
    `${API_ROOT}/v1/boards/supports/moving_card`,
    updateData
  )
  return responnse.data
}

//Column
export const addColumnAPI = async column => {
  const responnse = await axios.post(`${API_ROOT}/v1/columns`, column)
  return responnse.data
}

export const updateColumnAPI = async (columnId, updateData) => {
  const responnse = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  )
  return responnse.data
}

export const deleteColumnAPI = async (columnId) => {
  const responnse = await axios.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  )
  return responnse.data
}

//Card
export const addCardAPI = async card => {
  const responnse = await axios.post(`${API_ROOT}/v1/cards`, card)
  return responnse.data
}
