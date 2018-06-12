import React from 'react';
import axios from 'axios';

import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';

import {FacebookIcon, GooglePlusIcon, VkontakteIcon} from '../../Svg/SvgSocial'


// const socialAuthorization = ({onClick}) => {
//   return (
//     <div className="social">
//       <button onClick={(e) => onClick(e, 'facebook')} className="facebook" type="button">
//         <FacebookIcon/>
//       </button>
//
//       {/*<button onClick={(e) => onClick(e, 'google')} className="google" type="button">*/}
//       {/*<GooglePlusIcon/>*/}
//       {/*</button>*/}
//
//       {/*<button onClick={(e) => onClick(e, 'vkontakte')} className="vkontakte" type="button">*/}
//       {/*<VkontakteIcon/>*/}
//       {/*</button>*/}
//     </div>
//   )
// };

// export default socialAuthorization;

class SocialAuthorization extends React.Component {
  constructor() {
    super();
  }

  twitterResponse = (res) => {
  };

  facebookResponse = (res) => {
    console.log(res);

    // const tokenBlob = new Blob([JSON.stringify({access_token: res.accessToken}, null, 2)], {type : 'application/json'});

    const authUrl = '/auth/facebook';

    const reqParams = {
      method: 'POST',
      url: authUrl,
      headers: {'Authorization': 'Bearer '+ res.accessToken},
      // data: tokenBlob
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

  googleResponse = (res) => {
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
      </div>
    )
  }
}

export default SocialAuthorization;