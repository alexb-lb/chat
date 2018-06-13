import React from 'react';
import axios from 'axios';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'

class SocialAuthorization extends React.Component {
  constructor() {
    super();
  }

  onFailure = (error) => {
    console.log(error);
  };

  googleResponse = (res) => {
    console.log(res);
  };

  facebookResponse = (res) => {
    const reqParams = {
      method: 'POST',
      url: '/auth/facebook',
      headers: {'Authorization': 'Bearer ' + res.accessToken},
    };

    axios(reqParams).then(r => {
      console.log(r);
      // const token = r.headers.get('x-auth-token');
      // r.json().then(user => {
      //   if (token) {
      //     this.setState({isAuthenticated: true, user, token})
      //   }
      // });
    })
  };

  render() {

    return (
      <div className="social">

        <FacebookLogin
          appId={"" + FACEBOOK_APP_ID}
          autoLoad={false}
          fields="name,email,picture"
          callback={this.facebookResponse}
          cssClass="facebook"
          icon={<FacebookIcon />}
          textButton={false}
        />

        <GoogleLogin
          clientId={"" + GOOGLE_CLIENT_ID}
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="google"
          buttonText={<GooglePlusIcon/>}
        />
      </div>
    )
  }
}

export default SocialAuthorization;