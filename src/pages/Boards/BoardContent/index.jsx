import Box from '@mui/system/Box'

function BoardContent () {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.main',
        width: '100%',
        height: theme =>
          `calc(100vh - ${theme.jm.appBarHeight} - ${theme.jm.boardBarHeight})`,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      Boarc content
    </Box>
  )
}

export default BoardContent
