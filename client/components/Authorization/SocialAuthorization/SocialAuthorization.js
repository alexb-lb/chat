import React from 'react';
import axios from 'axios';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import VK, {Auth, Widgets} from 'react-vk';

import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'

class SocialAuthorization extends React.Component {
  constructor() {
    super();
  }

  onFailure = error => {
    console.log(error);
  };

  facebookResponse = res => {
    const reqParams = {
      method: 'POST',
      url: '/api/v1.0/auth/facebook',
      headers: {'access_token': res.accessToken},
    };

    axios(reqParams).then(r => {
      console.log(r);
    })
  };

  googleResponse = res => {
    const reqParams = {
      method: 'POST',
      url: '/api/v1.0/auth/google',
      headers: {'access_token':  res.accessToken}
    };

    axios(reqParams).then(r => {
      console.log(r);
    })
  };


  /**
   * Vkontakte API will be available after component mounted as this.vkApi
   * @param api = VK API initialized
   * @returns {*}
   */
  vkApi = api => {
    this.vkApi = api;
  };

  startVkontakteLogin = () => {
    this.vkApi.Auth.login(res => {
      const reqParams = {
        method: 'POST',
        url: '/api/v1.0/auth/vkontakte',
        headers: {'access_token': res.session.sid},
        data: { access_token: res.session.sid }
      };

      axios(reqParams).then(r => {
        console.log(r);
      })
    });
  };

  render() {

    return (
      <div className="social">

        <FacebookLogin
          appId={"" + FACEBOOK_APP_ID}
          autoLoad={false}
          scope="public_profile, email"
          // scope="email, user_age_range,user_birthday, user_gender, user_hometown, user_location, user_friends, user_photos"
          callback={this.facebookResponse}
          cssClass="facebook"
          icon={<FacebookIcon />}
          textButton={false}
        />

        <GoogleLogin
          clientId={"" + GOOGLE_CLIENT_ID}
          // scope='https://www.googleapis.com/auth/plus.login, https://www.googleapis.com/auth/plus.profile.emails.read, https://www.googleapis.com/auth/user.birthday.read, https://www.googleapis.com/auth/plus.me'
          scope="email profile openid https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/plus.me"
          onSuccess={this.googleResponse}
          onFailure={this.onFailure}
          className="google"
          buttonText={<GooglePlusIcon/>}
        />

        <VK apiId={"" + VKONTAKTE_CLIENT_ID} onApiAvailable={this.vkApi}>
          <button onClick={this.startVkontakteLogin} className="vkontakte" type="button">
            <VkontakteIcon/>
          </button>
        </VK>
      </div>
    )
  }
}

export default SocialAuthorization;