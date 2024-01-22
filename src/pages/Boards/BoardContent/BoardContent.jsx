import Box from '@mui/system/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'

function BoardContent ({ board }) {
  const orderedColumn = mapOrder(
    board?.columns,
    board?.columnOrderIds,
    '_id'
  )
  return (
    <Box
      sx={{
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        width: '100%',
        height: theme => theme.jm.boardContentHeight,
        p: '10px 0'
      }}
    >
      <ListColumns columns={orderedColumn} />
    </Box>
  )
}

export default BoardContent
