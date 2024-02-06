//board detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBard from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  addCardAPI,
  addColumnAPI,
  deleteColumnAPI,
  fetchBoardDetailAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailAPI,
  updateColumnAPI
} from '~/apis'
import { generatePlaceHolderCard } from '~/utils/formartter'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
function Board () {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    //use react router dom to update in future (get id by url)
    const boardId = '65bc31d0f76df4cef490d9b9'

    //call API
    fetchBoardDetailAPI(boardId).then(board => {
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceHolderCard(column)]
          column.cardOrderIds = [generatePlaceHolderCard(column)._id]
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, '_id')
        }
      })
      setBoard(board)
    })
  }, [])

  //create  new column and reload board data
  const createNewColumn = async data => {
    const createdColumn = await addColumnAPI({ ...data, boardId: board._id })

    //update state board
    const newBoard = { ...board }
    //handle drag card to new column
    createdColumn.cards = [generatePlaceHolderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceHolderCard(createdColumn)._id]

    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    setBoard(newBoard)
  }
  //create  new column and reload board data
  const createNewCard = async data => {
    const createdCard = await addCardAPI({ ...data, boardId: board._id })

    //update state board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      column => column._id === createdCard.columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards.push(createdCard)
      columnToUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  const moveColumn = dndOrderedColumns => {
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    //call API update Board
    updateBoardDetailAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds
    })
  }

  const moveCardOnColumn = (columnId, dndOrderedCards) => {
    const dndOrderedCardsIds = dndOrderedCards.map(c => c._id)
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      column => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)
    //call API update Board
    updateColumnAPI(columnId, {
      cardOrderIds: dndOrderedCardsIds
    })
  }

  const moveCardToDifferentColumn = async (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderColumn
  ) => {
    //update state board

    const dndOrderedColumnsIds = dndOrderColumn.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderColumn
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    const nextColumn = await dndOrderColumn.find(c => c._id === nextColumnId)

    const preColumn = await dndOrderColumn.find(c => c._id === prevColumnId)
    const preCardOrderIds = preColumn.cardOrderIds.filter(
      c => !c.includes('-place-holder-card')
    )
    // call api
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: preCardOrderIds,
      nextColumnId,
      nextCardOrderIds: nextColumn?.cardOrderIds
    })
  }

  const delteCOlumnDetails = columnId => {
    //update state of board
    const newBoard = { ...board }
    newBoard.columns = board.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = board.columnOrderIds.filter(
      _id => _id !== columnId
    )
    setBoard(newBoard)
    //call api
    deleteColumnAPI(columnId).then(res => {
      toast.success(res?.deleteResult, { position: 'bottom-right' })
    })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading board...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBard board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumn={moveColumn}
        moveCardOnColumn={moveCardOnColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        delteCOlumnDetails={delteCOlumnDetails}
      />
    </Container>
  )
}

export default Board
