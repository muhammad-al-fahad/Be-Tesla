/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next'

import enTranslation from '../langs/en.json'
import frTranslation from '../langs/fr.json'
import ptTranslation from '../langs/pt.json'

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAJviEDWC-i433k4s9cYISvUA1LZEn_Qgk",
  authDomain: "api-5001069758254805059-921002.firebaseapp.com",
  databaseURL: "https://api-5001069758254805059-921002.firebaseio.com",
  projectId: "api-5001069758254805059-921002",
  storageBucket: "api-5001069758254805059-921002.appspot.com",
  messagingSenderId: "97053800643",
  appId: "1:97053800643:web:c90a45de5f2120ee244a76",
  measurementId: "G-MHV1FYPNEV"
}

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

  const app = initializeApp(firebaseConfig)
  const analytics = getAnalytics(app)
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // Initialize state variables
  const [language, setLanguage] = useState('English');
  const [driver, setDriver] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true)
  const [accessToken, setAccessToken] = useState('');
  const [driverId, setDriverId] = useState('');

  // useEffect where the action should be perform on id
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch(`https://tookserver.herokuapp.com/web-passenger/driver-info?id=${id}`, {
          method: 'GET'
        });

        const result = await response.json();
        setLoading(false);
        setDriverId(result._id)

        if(result.success === true) {
          setDriver(result.driver);
        } else {
          setError("Driver not found");
          setSuccess(false);
        }
      } catch (error) {
        console.error(error.message)
      }
    }

    fetchDriver();
  }, [id])

  useEffect(() => {
    const driverRow = document.querySelector('.driver_row')
    if(accessToken && driverRow) {
      driverRow.classList.add('auth')
      setSuccess(true)
      setError('');
    }
  }, [accessToken])

  useEffect(() => {
    const lng = localStorage.getItem('language')
    const txt = localStorage.getItem('languageName')

    i18n.changeLanguage(lng)
    setLanguage(txt)

  }, [window.onload])

  // Declare custom functions
  function selectLanguage() {
    var element = document.querySelector('.language_popup');

    if(element.style.transform === 'translateY(1000px)') {
      element.style.transform = 'translateY(-120%)';
      element.style.transition = 'transform 0.75s ease-in-out';
    } else {
      element.style.transform = 'translateY(1000px)';
      element.style.transition = 'transform 0.75s ease-in-out';
    }
  }

  function changeLanguage(lng, txt) {
    window.location.reload();
    localStorage.setItem('language', lng);
    localStorage.setItem('languageName', txt);
    
    setTimeout(() => {
      i18n.changeLanguage(lng);
      var element = document.querySelector('.language_popup');
  
      setLanguage(txt);
  
      element.style.transform = 'translateY(1000px)';
      element.style.transition = 'transform 1s ease-in-out';
    }, 100)
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(async (result) => {

        const credential = GoogleAuthProvider.credentialFromResult(result)
        const accessToken = credential.accessToken;
        const idToken = credential.idToken;
        
        setAccessToken(accessToken);

        const googleAuth = await fetch('https://tookserver.herokuapp.com/web-passenger/auth/google', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken,
            idToken
          })
        });

        const storeAuth = await googleAuth.json();
        console.log(storeAuth)

        if(storeAuth.success === 'true') {
          const addDriver = await fetch('https://tookserver.herokuapp.com/web-passenger/add-driver', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              driverId
            })
          });

          const isdriverAdd = await addDriver.json();
          console.log(isdriverAdd)
        }
      })
      .catch((error) => {
        console.error(error.message)
      });
  };

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
                <div className='login-success'>
                  {accessToken && <h1 className='login-success-title'>{t('Driver Added Successfully')}!</h1>}
                </div>
                <div className='driver_image'>
                  <img src={driver.personalInfo.profileUrl ? driver.personalInfo.profileUrl : '/asset/images/invalid_image.png'} alt="Driver Image" />
                </div>

                <div className='driver_badge'>
                  <i className="fas fa-crown badge-icon"></i>
                  <p className='badge-title'>{t('premiumDriver')}</p>
                </div>

                <p className='year'>{t('privateDriverSince2023')}</p>
                <h2 className='driver_name'>{driver.personalInfo.name}</h2>

                <div className='driver_address'>
                  <i className="fas fa-map-marker-alt"></i>
                  <p className='address-title'>{`${driver.personalInfo.address.city}, ${driver.personalInfo.address.state}, ${driver.personalInfo.address.country}`}</p>
                </div>

                <div className='driver_contact'>
                  <i className="fas fa-phone-alt"></i>
                  <p className='contact-title'>{driver.accountCreds.phoneNumber}</p>
                </div>

                <div className='idn'>
                {accessToken &&
                  <>
                    <h2 className='idn-title'>Download IDN Private Application</h2>
                    <div className='idn-store'>
                      <img src='/asset/images/google_play.png' alt='Google Play' width={200} height={60}/>
                      <img src='/asset/images/apple_store.png' alt='Apple Store' width={200} height={60}/>
                    </div>

                    <h2 className='idn-title'>Download IDN Public Application</h2>
                    <div className='idn-store'>
                      <img src='/asset/images/google_play.png' alt='Google Play' width={200} height={60}/>
                      <img src='/asset/images/apple_store.png' alt='Apple Store' width={200} height={60}/>
                    </div>
                  </>
                }
                </div>
              </div>

              { !accessToken &&
                  <div className='login'>
                    <h1 className='login-title'>{t('Welcome to Driver Management')}</h1>
                    <h5 className='login-description'>{t('Please sign in to continue adding a driver')}</h5>
                    <button type='button' className='google' onClick={signInWithGoogle}>
                      <img src='/asset/images/google_icon.png' alt="Google Icon" />
                      <p className='google-title'>{t('Login with Google')}</p>
                    </button>
                  </div>
              }
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
