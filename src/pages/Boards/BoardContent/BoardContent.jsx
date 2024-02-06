import Box from '@mui/system/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  useSensor,
  useSensors,
  // TouchSensor,
  // MouseSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
  closestCenter
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLib/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import Column from './ListColumns/Column/Column'
import Cards from './ListColumns/Column/ListCards/Card/Cards'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceHolderCard } from '~/utils/formartter'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent ({
  board,
  createNewColumn,
  createNewCard,
  moveColumn,
  moveCardOnColumn,
  moveCardToDifferentColumn,
  delteCOlumnDetails
}) {
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 }
  // })

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }
  })

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }
  })
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderColumns] = useState([])

  //chỉ có một item được kéo tại một thời điểm
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnStartDragingCard, setOldColumnStartDragingCard] =
    useState(null)
  //last collistion point (handle alogist  colistion )
  const lastOverId = useRef(null)

  //rerender (update column sortion) after drap and drop column
  useEffect(() => {
    setOrderColumns(board?.columns)
  }, [board])

  //use map funtion to check each card on orderedColumn, if id of that card include cardId (to find column) then return it.
  const findColumnByCardId = cardId => {
    return orderedColumns.find(column =>
      column?.cards?.map(card => card._id)?.includes(cardId)
    )
  }
  //custom drop animate
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  const handleDragStart = event => {
    //set id item(column or card id)
    setActiveDragItemId(event?.active?.id)
    //set type of item (column or card)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    )
    //sett data of item
    setActiveDragItemData(event?.active?.data?.current)
    //setOldColumnStartDragingCard when draging card (orderedColumn always rerender when dragover(lost first value))
    //only set when item is card
    if (event?.active?.data?.current?.columnId) {
      setOldColumnStartDragingCard(findColumnByCardId(event?.active?.id))
    }
  }

  //update state when move card between columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDragingCardId,
    activeDragingCardData,
    triggerFrom
  ) => {
    setOrderColumns(preColumns => {
      //find destination over card index (where active card will drop)
      const overCardIndex = overColumn?.cards?.findIndex(
        card => card._id === overCardId
      )
      let newCardIndex
      //cacultate new index of active card of this column to another column
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1

      const nextColumns = cloneDeep(preColumns)
      const nextActiveColumn = nextColumns.find(
        column => column._id === activeColumn._id
      )
      const nextOverColumn = nextColumns.find(
        column => column._id === overColumn._id
      )

      if (nextActiveColumn) {
        //delete active card in current column begin drag
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          card => card._id !== activeDragingCardId
        )

        //add card have FE_PlaceHolderCard props if activeColumn is empty (use for whether drag card to this column)
        if (isEmpty(nextActiveColumn?.cards)) {
          nextActiveColumn.cards = [generatePlaceHolderCard(nextActiveColumn)]
        }
        //update cardOrderIds
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          card => card._id
        )
      }
      if (nextOverColumn) {
        // check if active card exist on over current then delete it.
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => card._id !== activeDragingCardId
        )

        //update columnId of card which draged
        // const rebuildActiveDragingCardData = {
        //   ...activeDragingCardData,
        //   columnId: nextOverColumn._id
        // }

        //add drag card to new column (use toSpliced to add toSpliced(index,))
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, {
          ...activeDragingCardData,
          columnId: nextOverColumn._id
        })

        //delete card have FE_PlaceHolderCard prop if it exist
        nextOverColumn.cards = nextOverColumn.cards.filter(
          card => !card?.FE_PlaceHolderCard
        )

        //call Api if trigger is handleDragEnd
        if (triggerFrom === 'handleDragEnd') {
          moveCardToDifferentColumn(
            activeDragingCardId,
            oldColumnStartDragingCard._id,
            nextOverColumn._id,
            nextColumns
          )
        }

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

  const handleDragOver = event => {
    // console.log('activeDragItemType', activeDragItemType)
    //handle only card drag over
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    //use destructuring assignment to quick declare variable
    const { active, over } = event

    //prevent crash website
    if (!over || !active) return

    const {
      id: activeDragingCardId,
      data: { current: activeDragingCardData }
    } = active

    const { id: overCardId } = over

    const activeColumn = findColumnByCardId(activeDragItemId)
    const overColumn = findColumnByCardId(overCardId)

    if (!activeColumn || !overColumn) return

    //handle drag card to another column
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDragingCardId,
        activeDragingCardData,
        'handleDragOver'
      )
    }
  }

  const handleDragEnd = event => {
    const { active, over } = event

    if (!over || !active) return
    //handle drag card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      const {
        id: activeDragingCardId,
        data: { current: activeDragingCardData }
      } = active

      const { id: overCardId } = over

      const activeColumn = findColumnByCardId(activeDragItemId)
      const overColumn = findColumnByCardId(overCardId)

      //drag drop between 2 column
      //must use oldColumnStartDragingCard which set dragStart instead of activeColumn because activeColumn updated when dragOver.
      if (oldColumnStartDragingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDragingCardId,
          activeDragingCardData,
          'handleDragEnd'
        )
      }
      //drag drop on same column
      else {
        //get index of card which draged
        const oldCardIndex = oldColumnStartDragingCard?.cards?.findIndex(
          c => c._id === activeDragItemId
        )
        //get index of card which droped
        const newCardIndex = overColumn?.cards?.findIndex(
          c => c._id === overCardId
        )
        //sort list columns after drag drop by arrayMove
        const dndOrderedCards = arrayMove(
          oldColumnStartDragingCard?.cards,
          oldCardIndex,
          newCardIndex
        )

        setOrderColumns(preColumn => {
          const nextColumn = cloneDeep(preColumn)
          //find column which 'card is drop
          const targetColumn = nextColumn.find(
            column => column._id === overColumn._id
          )
          targetColumn.cards = dndOrderedCards
          //update cardOrderIds on column json object
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          return nextColumn
        })

        moveCardOnColumn(oldColumnStartDragingCard._id, dndOrderedCards)
      }
    }

    //handle drag column
    if (
      activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN &&
      active.id !== over.id
    ) {
      const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
      const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

      //sort list columns after drag drop by arrayMove (change location of old and newColumnIndex in orderedColumns Array)
      const dndOrderedColumns = arrayMove(
        orderedColumns,
        oldColumnIndex,
        newColumnIndex
      )
      setOrderColumns(dndOrderedColumns)

      moveColumn(dndOrderedColumns)
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
      //call API update orderColumnIds on dtbase
      // updateOrderColumnIds(board._id, {
      //   orderColumnIds: dndOrderedColumns.map(e => e._id)
      // })
    }
    //set null for all dragdrop data when drop (prevent crash page)
    setActiveDragItemId(null)
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setOldColumnStartDragingCard(null)
  }

  const collisionDetectionStrategy = useCallback(
    args => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        //use closesCorners aalgorithsm for drag column
        return closestCorners({ ...args })
      }

      // First, let's see if there are any collisions with the pointer
      const pointerCollisions = pointerWithin(args)

      //return if pointerCollisions = null (prevent bug flickering when drag card to top of between two column)
      if (!pointerCollisions?.length) return
      // Collision detection algorithms return an array of collisions
      const collisions = !!pointerCollisions?.length
        ? pointerCollisions
        : rectIntersection(args)

      //find first overid in collision below
      let overId = getFirstCollision(collisions, 'id')

      if (overId) {
        const checkColumn = orderedColumns.find(column => column._id === overId)
        if (checkColumn) {
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(container => {
              return (
                container.id != overId &&
                checkColumn?.cardOrderIds?.includes(container.id)
              )
            })
          })[0]?.id
        }
        lastOverId.current = overId
        return [{ id: overId }]
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : []
    },
    [activeDragItemType, orderedColumns]
  )

  return (
    <DndContext
      //use closestCorners fix bug confict between small and large card on draging (drag and drop large card unavailable)
      //unUse closestCorners, it cause flickering and wrong data when drag card between two column
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box
        sx={{
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
          width: '100%',
          height: theme => theme.jm.boardContentHeight,
          p: '10px 0'
        }}
      >
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          delteCOlumnDetails = {delteCOlumnDetails}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType == ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Cards card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
