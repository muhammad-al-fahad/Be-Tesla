/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next'
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google'

import enTranslation from '../langs/en.json';
import frTranslation from '../langs/fr.json';
import ptTranslation from '../langs/pt.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      pt: {
        translation: ptTranslation
      },
      fr: {
        translation: frTranslation
      }
    },
    lng: 'en', // set initial language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

function DriverProfile() {
  // Get varibale from http query
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('driverId');

  const {t, i18n} = useTranslation()
  document.title = t('Add your driver');

  // Initialize state variables
  const [language, setLanguage] = useState('English');
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true)

  // useEffect where the action should be perform on id
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`https://tookserver.herokuapp.com/web-passenger/driver-info?id=${id}`, {
          method: 'GET'
        });

        const result = await response.json();
        setLoading(false);

        if(result.success === true) {
          setDriver(result.driver);
        } else {
          setError("Driver not found");
        }
      } catch (error) {
        setError(error.message)
      }
    }

    
    fetchDriver();
  }, [id])

  // Declare custom functions
  function selectLanguage() {
    var element = document.querySelector('.language_popup');

    if(element.style.transform === 'translateY(1000px)') {
      element.style.transform = 'translateY(0)';
      element.style.transition = 'transform 0.75s ease-in-out';
    } else {
      element.style.transform = 'translateY(1000px)';
      element.style.transition = 'transform 0.75s ease-in-out';
    }
  }

  function changeLanguage(lng, txt) {
    
    i18n.changeLanguage(lng);
    var element = document.querySelector('.language_popup');
    setLanguage(txt);
    element.style.transform = 'translateY(1000px)';
    element.style.transition = 'transform 1s ease-in-out';
  }

  function responseGoogle(response) {
    console.log(response)
  }

  return (
    <div className='container'>
      <div className='driver-profile__area'>
        { !loading ? 
          <>
          {
            error && 
            <div className='error-area'>
              <div className='error'>
                <i className='fas fa-exclamation-circle fa-3x'></i>
                <p className='error-title'>{error}</p>
                <button onClick={() => setLoading(true)} type='button'>{t('OK')}</button>
              </div>
            </div> 
          }
          { id && driver &&
            <div className='driver_row'>
              <div className='driver_profile'>
                <div className='driver_image'>
                  <img src={driver.personalInfo.profileUrl ? driver.personalInfo.profileUrl : '/asset/images/invalid_image.png'} alt="driver-image" />
                </div>

                <div className='driver_badge'>
                  <i className="fas fa-crown badge-icon"></i>
                  <p className='badge-title'>{t('premiumDriver')}</p>
                </div>

                <p className='year'>{t('privateDriverSince2023')}</p>
                <h2 className='driver_name'>{driver.personalInfo.name}</h2>

                <div className='driver_address'>
                  <i className="fas fa-map-marker-alt address-icon"></i>
                  <p className='address-title'>{`${driver.personalInfo.address.city}, ${driver.personalInfo.address.state}, ${driver.personalInfo.address.country}`}</p>
                </div>

                <div className='driver_contact'>
                  <i className="fas fa-phone-alt contact-icon"></i>
                  <p className='contact-title'>{driver.accountCreds.phoneNumber}</p>
                </div>
              </div>

              <div className='login'>
                <h1 className='login-title'>{t('Welcome to Driver Management')}</h1>
                <h5 className='login-description'>{t('Please sign in to continue adding a driver')}</h5>
                <div className='google-lgin'></div>
                <GoogleOAuthProvider clientId="248512364814-3mlglq52je3233ofmrdbgt6f74p9g341.apps.googleusercontent.com">
                  <GoogleLogin
                    onSuccess={credentialResponse => {
                      console.log(credentialResponse);
                    }}
                    onError={() => {
                      console.log('Login Failed');
                    }}
                  />
                </GoogleOAuthProvider>
              </div>
            </div>
          }
          </>
          :
          <div className='loading'>
            <i className='fas fa-circle-notch fa-spin fa-4x'></i>
          </div>
        }

          <div className='language_row'>
            <div className='language-select'>
              <p className='language-title'>{language}</p>
              <button className='language-selecter' onClick={selectLanguage}><i className="fas fa-sort-down"></i></button>
            </div>

            <div className='language_popup'>
              <ul className='language-list'>
                <li onClick={() => changeLanguage('en', 'English')} className='language-item'>English</li>
                <li onClick={() => changeLanguage('pt', 'Portuguese')} className='language-item'>Portuguese</li>
                <li onClick={() => changeLanguage('fr', 'French')} className='language-item'>French</li>
              </ul>
            </div>
          </div>
      </div>
    </div>
  )
}

export default DriverProfile;
