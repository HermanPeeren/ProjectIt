import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, themes } from '@fluentui/react-northstar';
import {App} from './projectit-webapp/App';


ReactDOM.render(
    <Provider theme={themes.teams}>
      <App />
    </Provider>,
    document.getElementById('root'),
)
