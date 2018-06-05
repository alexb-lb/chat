import React from 'react';
import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'

const SocialAuthorization = () => (
  <div className="social">

    <a href="/auth/facebook" className="facebook" type="button">
      <FacebookIcon/>
    </a>

    <button className="google" type="button">
      <GooglePlusIcon/>
    </button>

    <button className="vkontakte" type="button">
      <VkontakteIcon/>
    </button>

  </div>
);

export default SocialAuthorization;