//board detail
import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBard from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
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
