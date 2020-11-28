import React, { useState, useEffect, useMemo } from 'react';
import RenderCustPro from './RenderCustPro';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const CustProContainer = () => {
  //grabbing user info from okta for test purposes
  //all info could/should be grabbed by state if possible
  const { authService } = useOktaAuth();
  const [userInfo, setUserInfo] = useState({});
  const [memoAuthService] = useMemo(() => [authService], [authService]);

  const [custInfo, setCustInfo] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [updated, setUpdated] = useState(false);

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
      })
      .catch(err => {
        isSubscribed = false;
        return setUserInfo(null);
      });
    return () => (isSubscribed = false);
  }, [memoAuthService]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URI}/customers/${userInfo.sub}`)
      .then(res => {
        if (res.data) {
          setCustInfo(res.data);
          setIsRegistered(true);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }, [userInfo, updated]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  return (
    <RenderCustPro
      userInfo={userInfo}
      isRegistered={isRegistered}
      custInfo={custInfo}
      showForm={showForm}
      toggleForm={toggleForm}
      updated={updated}
      setUpdated={setUpdated}
    />
  );
};

export default CustProContainer;