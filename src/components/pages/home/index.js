import { withRouter } from 'react-router-dom';
// import randomMaterialColor from 'random-material-color';
// import Color from 'color';

import Auth from '../../auth';

const Home = ({
  user,
  firebase,
  setLocalConfig,
  localConfig,
  setIsLoading,
  isSignedIn
}) => {
  return (
    <div>
      <Auth
        user={user}
        firebase={firebase}
        isSignedIn={isSignedIn}
        setIsLoading={setIsLoading}
      />
    </div>
  )
};

export default withRouter(Home);
