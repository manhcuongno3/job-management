import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { cyan, deepOrange, orange, teal } from '@mui/material/colors'

// Create a theme instance.
const theme = extendTheme({
  jm:{
    appBarHeight: '48px',
    boardBarHeight: '58px'
  },
  colorSchemes: {
    light: {
      palette: {
        primary: teal,
        secodary: deepOrange
      },
      spacing: factor => `${0.25 * factor}rem`
    },
    dark: {
      palette: {
        primary: cyan,
        secodary: orange
      },
      spacing: factor => `${0.25 * factor}rem`
    }
  }
  // ...other properties
})
export default theme
