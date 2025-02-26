import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';
import Register from './pages/Register';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Sports from './pages/Sports';
import SportDetail from './components/SportDetail';

//css
import '../src/pages/Page.css';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import 'bootstrap/dist/css/bootstrap.min.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('token'); // Comprueba si hay un token de autenticación

  return (
      <IonApp>
          <IonReactRouter>
              <IonRouterOutlet>
                  {/* Rutas de autenticación */}
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />

                  {/* Rutas protegidas */}
                  {isAuthenticated ? (
                      <>
                          <Route exact path="/home" component={Home} />
                          <Route exact path="/home/sports" component={Sports} />
                          <Route exact path="/sports/:id" component={SportDetail} />
                          
                      </>
                  ) : (
                      <Redirect to="/login" />
                  )}
              </IonRouterOutlet>
          </IonReactRouter>
      </IonApp>
  );
};

export default App;
