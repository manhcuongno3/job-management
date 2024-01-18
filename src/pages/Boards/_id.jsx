//board detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar'
import BoardBard from './BoardBar'
import BoardContent from './BoardContent'
function Board () {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBard />
      <BoardContent />
    </Container>
  )
}

export default Board
