import React from 'react';
import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'

const SocialAuthorization = () => (
  <div className="social">

    <button className="facebook" type="button">
      <FacebookIcon/>
    </button>

    <button className="google" type="button">
      <GooglePlusIcon/>
    </button>

    <button className="vkontakte" type="button">
      <VkontakteIcon/>
    </button>

  </div>
);

export default SocialAuthorization;