import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import VK from 'react-vk';

import {startSocialAuthenticate} from '../../../actions/auth';

import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'

class SocialAuthorization extends React.Component {
  constructor(props) {
    super(props);
  }

  onFailure = error => console.log(error);

  facebookResponse = res => this.props.startSocialAuthenticate('facebook', res.accessToken);

  googleResponse = res => this.props.startSocialAuthenticate('google', res.accessToken);


  /**
   * Vkontakte API will be available after component mounted as this.vkApi
   * @param api = VK API initialized
   * @returns {*}
   */
  vkApi = api => {
    this.vkApi = api;
  };
  startVkontakteLogin = () => this.props.startSocialAuthenticate('vkontakte', res.session.sid);


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

const mapDispatchToProps = (dispatch) => ({
  startSocialAuthenticate: (socNetworkName, token) => dispatch(startSocialAuthenticate(socNetworkName, token))
});

export default connect(null, mapDispatchToProps)(SocialAuthorization);