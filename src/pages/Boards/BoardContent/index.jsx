import Box from '@mui/system/Box'

function BoardContent () {
  return (
    <Box
      sx={{
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
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
