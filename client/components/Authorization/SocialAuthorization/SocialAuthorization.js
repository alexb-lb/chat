import React from 'react';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'


class SocialAuthorization extends React.Component {
  constructor() {
    super();
  }

  twitterResponse = (e) => {};

  facebookResponse = (e) => {};

  googleResponse = (e) => {};

  render() {

    return  (
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

        {/*<button onClick={(e) => onClick(e, 'facebook')} className="facebook" type="button">*/}
          {/*<FacebookIcon/>*/}
        {/*</button>*/}

        {/*<button onClick={(e) => onClick(e, 'google')} className="google" type="button">*/}
          {/*<GooglePlusIcon/>*/}
        {/*</button>*/}

        {/*<button onClick={(e) => onClick(e, 'vkontakte')} className="vkontakte" type="button">*/}
          {/*<VkontakteIcon/>*/}
        {/*</button>*/}

      </div>
    )
  }
}

export default SocialAuthorization;