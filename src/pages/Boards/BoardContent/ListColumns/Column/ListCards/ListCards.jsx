import Box from '@mui/system/Box'
import Cards from './Card/Cards'

function ListCards () {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        p: '0 5px',
        m: '0 5px',
        overflowX: 'hidden',
        overflowY: 'auto',
        maxHeight: theme =>
          `calc(${theme.jm.boardContentHeight} - ${theme.spacing(5)} - ${
            theme.jm.columnHeaderHeight
          } - ${theme.jm.columnFooterHeight})`,
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#ced0da'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#bfc2cf'
        }
      }}
    >
      {/* card items */}
      <Cards />
      <Cards temporaryHideMedia />
    </Box>
  )
}

export default ListCards
