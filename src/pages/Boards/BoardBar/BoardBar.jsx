import Box from '@mui/system/Box'
import Chip from '@mui/material/Chip'
import Dashboard from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formartter'

const MENU_STYLE = {
  paddingX: '5px',
  border: 'none',
  color: 'white',
  bgcolor: 'transparent',
  borderRadius: '5px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar ({ board }) {
  return (
    <Box
      px={2}
      sx={{
        // backgroundColor: 'primary.dark',
        width: '100%',
        height: theme => theme.jm.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: theme =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<Dashboard />}
            label={board?.title}
            clickable
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          label='Add to Google Drive'
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          label='Automation'
          clickable
        />

        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          label='Filters'
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://www.nj.com/resizer/iqV2J-QFgh0227ybHBor4exTVBk=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'
            />
          </Tooltip>
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://cdn-icons-png.flaticon.com/128/2202/2202112.png'
            />
          </Tooltip>
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://www.nj.com/resizer/iqV2J-QFgh0227ybHBor4exTVBk=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'
            />
          </Tooltip>
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://www.nj.com/resizer/iqV2J-QFgh0227ybHBor4exTVBk=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'
            />
          </Tooltip>
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://www.nj.com/resizer/iqV2J-QFgh0227ybHBor4exTVBk=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'
            />
          </Tooltip>
          <Tooltip title='CuongPC'>
            <Avatar
              alt='CuongPC'
              src='https://www.nj.com/resizer/iqV2J-QFgh0227ybHBor4exTVBk=/800x0/smart/cloudfront-us-east-1.images.arcpublishing.com/advancelocal/SJGKVE5UNVESVCW7BBOHKQCZVE.jpg'
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
