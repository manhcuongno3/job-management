import Typography from '@mui/material/Typography'
import Box from '@mui/system/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import ContentCut from '@mui/icons-material/ContentCut'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import CloseIcon from '@mui/icons-material/Close'
import TextField from '@mui/material/TextField'
import { toast } from 'react-toastify'
import { useConfirm } from 'material-ui-confirm'

function Column ({ column, createNewCard, delteCOlumnDetails }) {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const [openNewCardForm, setOpenNewCardForm] = useState(false)

  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Plsease enter Column title', { position: 'bottom-right' })
      return
    }
    createNewCard({ title: newCardTitle, columnId: column._id })
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete column',
      description:
        'This action is permanently delete your card and its cards! Are you sure?'
    })
      .then(() => {
        //
        delteCOlumnDetails(column._id)
      })
      .catch(() => {})
  }
  const orderedCard = column?.cards
  //use useSortable (abstraction is useDragtion and useDroption) to drag and drop item, need id to identify item (can add another data to use when get event of onDrapStart or onDrapEnd)
  //use spread syntax ( data: { ...column }) to clone column data to  new json ofect named data
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: column._id, data: { ...column } })

  const dndKitColumnStyle = {
    touchAction: 'none',
    //dung CSS.Translate. thay cho CSS.Transform để tránh column bị stretch (kéo dãn theo các column khác)
    transform: CSS.Translate.toString(transform),
    transition,
    //heigt 100% tránh trường hợp lỗi khi kéo column ngắn qua column dài, kết hợp với listener trong box fix bug kéo bên dưới column (không kéo vào column) cũng kéo được (bug ở mobile)
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  return (
    //bọc thẻ div ở ngoài tránh bug về chiều cao của column
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: theme =>
            `calc(${theme.jm.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box column header */}
        <Box
          sx={{
            height: theme => theme.jm.columnHeaderHeight,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            variant='h6'
            sx={{ fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}
          >
            {column?.title}
          </Typography>
          <Box>
            <div>
              <Tooltip title='More options'>
                <ExpandMoreIcon
                  sx={{ color: 'text.main', cursor: 'pointer' }}
                  id='basic-button-column-dropdown'
                  aria-controls={open ? 'basic-menu-recent' : undefined}
                  aria-haspopup='true'
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id='basic-menu-recent'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button-column-dropdown'
                }}
              >
                <MenuItem
                  sx={{
                    '&:hover': {
                      color: 'success.light',
                      '& .add-card-icon': { color: 'success.light' }
                    }
                  }}
                  onClick={toggleOpenNewCardForm}
                >
                  <ListItemIcon>
                    <AddCardIcon className='add-card-icon' fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Add new card </ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCut fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Cut </ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentCopy fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon>
                    <ContentPaste fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Pase</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem>
                  <ListItemIcon>
                    <Cloud fontSize='small' />
                  </ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
                <MenuItem
                  sx={{
                    '&:hover': {
                      color: 'warning.dark',
                      '& .delete-forever-icon': { color: 'warning.dark' }
                    }
                  }}
                  onClick={handleDeleteColumn}
                >
                  <ListItemIcon>
                    <DeleteForeverIcon
                      className='delete-forever-icon'
                      fontSize='small'
                    />
                  </ListItemIcon>
                  <ListItemText>Remove this column</ListItemText>
                </MenuItem>
              </Menu>
            </div>
          </Box>
        </Box>
        {/* Box List card */}
        <ListCards cards={orderedCard} />
        {/* Box column Footer */}
        <Box
          sx={{
            height: theme => theme.jm.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                justifyContent: 'space-between'
              }}
            >
              <Button
                onClick={toggleOpenNewCardForm}
                startIcon={<AddCardIcon />}
              >
                Add new card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                gap: 1
              }}
            >
              <TextField
                label='Enter card title...'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={e => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& label.Mui-focused': {
                    color: theme => theme.palette.primary.main
                  },
                  '& input': {
                    color: theme => theme.palette.primary.main,
                    bgcolor: theme =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white'
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    },
                    '&:hover fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme => theme.palette.primary.main
                    }
                  }
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: theme => theme.palette.success.main,
                    '&:hover': { bgcolor: theme => theme.palette.success.main }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: theme => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
