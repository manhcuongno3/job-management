import Box from '@mui/system/Box'
// import ModeSelect from '../../components/ModeSelect'
import ModeSelect from '~/components/ModeSelect'

function AppBar () {
  return (
    <Box
      sx={{
        backgroundColor: 'primary.light',
        width: '100%',
        height: theme => theme.jm.appBarHeight,
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <ModeSelect />
    </Box>
  )
}

export default AppBar