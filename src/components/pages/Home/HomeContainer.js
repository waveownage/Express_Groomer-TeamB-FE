import React, { useState, useEffect, useMemo } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import GroomerProfilePage from '../GroomerProfile/GroomerProfilePage';
import RenderSearchPage from '../Search/RenderSearchPage';
import { getUserID } from '../../../api/index';

function HomeContainer({ LoadingComponent }) {
  const { authState, authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState(null);
  // eslint-disable-next-line
  const [memoAuthService] = useMemo(() => [authService], []);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    let isSubscribed = true;

    memoAuthService
      .getUser()
      .then(info => {
        // if user is authenticated we can use the authService to snag some user info.
        // isSubscribed is a boolean toggle that we're using to clean up our useEffect.
        if (isSubscribed) {
          setUserInfo(info);
        }

        return getUserID(
          `http://localhost:8000/profiles/${info.sub}`,
          authState
        );
      })
      .then(res => {
        setUserRole(res.role);
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService, authState]);

  console.log('this is in conditional', userRole);
  if (userRole === 'groomer') {
    return (
      <div>
        {authState.isAuthenticated && !userInfo && (
          <LoadingComponent message="Fetching user profile..." />
        )}
        {authState.isAuthenticated && userInfo && (
          <GroomerProfilePage userInfo={userInfo} authService={authService} />
        )}
      </div>
    );
  } else if (userRole === 'customer') {
    return (
      <div>
        {authState.isAuthenticated && !userInfo && (
          <LoadingComponent message="Fetching user profile..." />
        )}
        {authState.isAuthenticated && userInfo && (
          <RenderSearchPage userInfo={userInfo} authService={authService} />
        )}
      </div>
    );
  } else {
    return (
      <div>
        {authState.isAuthenticated && !userInfo && (
          <LoadingComponent message="Fetching user profile..." />
        )}
        {authState.isAuthenticated && userInfo && (
          <RenderSearchPage userInfo={userInfo} authService={authService} />
        )}
      </div>
    );
  }
}

//   return (
//     <>
//         {authState.isAuthenticated && !userInfo && (
//           <LoadingComponent message="Fetching user profile..." />
//         )}
//         {authState.isAuthenticated && userInfo && (
//           <GroomerProfilePage userInfo={userInfo} authService={authService} />
//         )}
//     </>
//   );
// }

export default HomeContainer;
