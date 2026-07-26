import { createTheme, ThemeProvider } from '@material-ui/core/styles';

export const theme = createTheme({
  palette : {
    primary : {
      //main : "#e6e600"
      //main : '#ffea00'    // this one      
      //main : yellow[500]            
      main : '#3194da'   //underit blue color
    },
    secondary : { 
      main : '#fcba03'
      //main : 'rgb(188, 194, 69)'
      //main : 'hsl(118, 73%, 37%)'
    }        
  },  
});
