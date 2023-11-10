/* eslint-disable react/jsx-pascal-case */
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Not_Found from './404';

function DriverProfile() {
  document.title = "Add driver driver"

  // Get varibale from http query
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('driverId');

  // Initialize state variables

  // useHook where the action should be perform on id

  // Declare custom functions

  return (
    <div className='container'>
      { id ?
        <div className='driver-profile__area'>
          <div className='driver_row'>
            <div className='driver_profile'>
              <div className='driver_image'>
                <img src="/assets/img/driver_image.avif" alt="driver-image" />
              </div>

              <div className='driver_badge'>
                <i class="fas fa-crown badge-icon"></i>
                <p className='badge-title'>Premium Driver</p>
              </div>

              <p className='year'>Private Driver Since 2023</p>
              <h2 className='driver_name'>Muhammad Khuram</h2>

              <div className='driver_address'>
                <i class="fas fa-map-marker-alt address-icon"></i>
                <p className='address-title'>Khanewal, Punjab, Pakistan</p>
              </div>

              <div className='driver_contact'>
                <i class="fas fa-phone-alt contact-icon"></i>
                <p className='contact-title'>+92316607213</p>
              </div>
            </div>

            <div className='login'>
              <h1 className='login-title'>Welcome <span>to</span> <span>Driver</span> <span>Management</span></h1>
              <h5 className='login-description'>Please <span>sign</span> <span>in</span> <span>to</span> <span>continue</span> <span>adding</span> <span>driver</span></h5>
              <button type='button' className='google'>
                <img src='/assets/img/IOS_Google_icon.png' alt='Google-icon' width={50} height={50}/>
                <p className='google-title'>Login <span>with</span> <span>Google</span></p>
              </button>
            </div>
          </div>

          <div className='language_row'>
            <div className='footer'>
              <p className='language-title'>English</p>
              <i class="fas fa-sort-down"></i>
            </div>
          </div>
        </div>
        :
        <Not_Found/>
      }
    </div>
  )
}

export default DriverProfile;
