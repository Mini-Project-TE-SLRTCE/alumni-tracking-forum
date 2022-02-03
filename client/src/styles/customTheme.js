import { createMuiTheme } from "@material-ui/core/styles";

const customTheme = (darkMode) =>
  createMuiTheme({
    palette: {
      type: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#c3fdff" : "#304ffe",
      },
      secondary: {
        main: darkMode ? "#90caf9" : "#0d47a1",
      },
      background: {
        paper: darkMode ? "#212121" : "#f5f5f5",
      },
    },
    overrides: {
      MuiTypography: {
        root: {
          wordBreak: "break-word",
        },
      },
    },
  });

export default customTheme;
