import { extendTheme } from "@chakra-ui/react"

const Container = {
  baseStyle: {
    maxW: '80ch',
  }
}

const theme = extendTheme({
  components: {
    Container
  }
})

export default theme