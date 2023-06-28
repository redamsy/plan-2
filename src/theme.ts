import { createTheme } from "@mui/material/styles";

const defaultTheme = createTheme();

export default createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: '1.1rem', //override to make tooltip font size larger
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        thumb: {
          color: 'pink', //change the color of the switch thumb in the columns show/hide menu to pink
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          textTransform: "none",
          // color: "rgb(40, 42, 43)",
          fontSize: "0.9rem",
          transition: defaultTheme.transitions.create(
            ["background-color", "box-shadow", "border", "color"],
            {
              duration: defaultTheme.transitions.duration.short,
            }
          ),
        },
        text: {
          padding: "6px 14px",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlinedPrimary: {
          border: "2px solid #027AC5",
          "&:hover": {
            border: "2px solid rgb(1, 85, 137)",
          },
        },
        startIcon: {
          marginRight: "6px",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          // color: "rgb(40, 42, 43)",
          fontSize: "0.9rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "0.9rem",
        },
      },
    },
    // MuiSelect: {
    //   styleOverrides: {
    //     root: {
    //       padding: "0.85em",
    //     },
    //   },
    // },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "16px",
        },
      },
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: {
    //       color: "rgb(40, 42, 43)",
    //     },
    //   },
    // },
    // MuiInputLabel: {
    //   styleOverrides: {
    //     root: {
    //       color: "rgb(40, 42, 43)",
    //       fontSize: "1.1rem",
    //       marginBottom: "0.2em",
    //       fontWeight: 500,
    //     },
    //   },
    // },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: {
          borderColor: "rgb(136, 140, 142)",
        },
      },
    },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    button: {
      textTransform: 'none', //customize typography styles for all buttons in table by default
      fontSize: '1.2rem',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: "#14B8A6",
    },
    background: {
      default:'#000', //pure black table in dark mode for fun
    },
  },
});
