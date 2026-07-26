import { ThemeProvider } from '@material-ui/core/styles';
import { Provider } from 'react-redux'
import { theme } from './theme.style';
import store from '../../data-source/store';
import { BrowserRouter } from 'react-router-dom';
import App from './App.js'


function AppWrapper(props){

  return (
    <ThemeProvider theme={theme}> 
      <Provider store={ store } >
        <BrowserRouter >
          <App />    
        </BrowserRouter>
      </Provider>         
    </ThemeProvider> 
    )
}

export default AppWrapper;