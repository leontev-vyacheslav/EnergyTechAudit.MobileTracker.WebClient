import React from 'react';
import AppConstants from '../../constants/app-constants';

import './about.scss';

export default () => (
    <>
        <h2 className={ 'content-block' }>О программе</h2>
        <div className={ 'content-block' }>
            <div className={ 'dx-card responsive-paddings' }>
                <div className={ 'about-app-info' } style={ { display: 'flex', flexDirection: 'row' } }>
                    <svg version="1.1" x="0" y="0" width="50" height="50" viewBox="0 0 500 500">
                        <g>
                            <path d="M364.312,255.212c-0.133-3.75-0.58-7.456-1.309-11.11l-16.021,33.04l-50.274-103.674l-24.961-10.68
              c-6.238-2.328-11.67-5.313-17.055-8.221c-9.125-4.926-16.569-11.15-21.334-18.061c-5.881-8.527-7.318-17.961-5.543-27.839
              c3.41-18.938,18.586-38.214,36.421-55.488c10.965-10.62,23.385-20.864,36.923-30.575c2.699-1.939,5.447-3.856,8.259-5.742
              c2.2-1.473,1.991-1.229,0.356-2.396c-2.559-1.827-5.121-3.655-7.686-5.483c-6.033,3.215-11.826,6.604-17.486,10.045
              c-3.223,1.957-6.396,3.947-9.524,5.953l-4.127,2.672c-1.754-0.918-3.513-1.834-5.265-2.752l4.115-2.488
              c3.412-2.039,6.864-4.061,10.371-6.047c5.981-3.391,12.09-6.721,18.432-9.869c-1.739-1.242-3.481-2.484-5.223-3.729
              c-1.033-0.735-2.066-1.471-3.099-2.209c-0.801-0.572-0.625-0.787-1.885-0.248c-11.295,4.818-22.236,9.952-32.844,15.336
              c-25.586,12.985-49.939,27.466-70.002,43.402c-20.824,16.537-38.434,34.348-48.613,53.264
              c-10.209,18.969-12.967,38.14-8.316,56.23c2.346,9.121,6.975,17.605,12.447,25.912c5.551,8.42,13.42,15.928,21.445,23.402
              c5.572,5.438,13.195,9.967,19.123,15.252c3.855,3.441,6.977,7.055,9.855,10.86c2.65,3.508,4.148,7.708,4.443,11.759
              c0.285,3.974-1.092,7.746-3.613,11.726c-2.645,4.178-7.32,8.268-11.846,11.985c-4.787,3.937-10.061,7.686-15.637,11.279
              c-23.291,15.022-51,27.706-79.117,39.205l-0.051,71.813c8.939-4.079,18.836-9.026,26.824-14.126l16.148,17.905
              c-13.547,8.65-31.109,16.59-42.988,21.559l-0.051,71.867c54.424-26.931,106.729-55.756,153.385-87.394
              c44.568-30.354,85.189-63.992,107.887-100.556C358.274,292.638,364.958,273.519,364.312,255.212z M191.738,106.707
              c-5.689,12.778-7.309,25.739-3.543,37.753c-5.621,1.079-11.24,2.157-16.861,3.235c-3.719-16.26,1.018-33.686,11.828-50.42
              c5.492-8.504,12.512-16.723,20.313-24.793c1.883-1.945,3.949-3.842,5.961-5.751c0.723-0.686,2.918-2.872,2.918-2.872
              s6.287,1.861,9.088,2.676c0.033,0.011,0.066,0.021,0.1,0.03c-0.305,0.276-0.59,0.558-0.859,0.845
              C208.38,80.106,197.818,93.053,191.738,106.707z M278.781,294.362c-0.091,0.124-0.119,0.161-0.127,0.169
              c-10.502,14.487-23.843,28.065-40.194,41.087c-15.41,12.271-32.73,23.66-50.754,34.711c-7.51-4.448-15.018-8.896-22.525-13.344
              c22.809-13.053,44.715-26.768,62.75-42.093c8.885-7.552,16.459-15.351,23-23.495l1.584-1.82c1.046,0.147,2.289,0.346,3.334,0.49
              c3.658,0.513,7.324,1.025,10.986,1.537c3.127,0.438,6.252,0.877,9.383,1.312c0.887,0.124,1.777,0.249,2.664,0.374
              C279.818,293.423,279.154,293.776,278.781,294.362z M264.113,249.08c-2.425-12.625-11.693-23.797-23.765-33.307
              c-6.684-5.268-14.58-9.896-22.314-14.598c-6.678-4.059-12.707-8.354-18.641-12.803c3.121-1.521,6.244-3.042,9.363-4.559
              c2.004-0.977,7.5-3.773,7.5-3.773s-0.137-0.104,0.861,0.569c5.191,3.496,10.455,6.839,16.176,10.036
              c6.389,3.571,12.963,7.027,19.043,10.783c-0.259-0.16-0.384-0.24,0.19,0.116c0.541,0.339,0.457,0.29,0.228,0.149
              c18.401,11.646,32.762,25.727,37.368,42.469C281.453,245.803,272.785,247.441,264.113,249.08z"/>
                            <path d="M346.981,31.078c-36.592,0-66.356,29.768-66.356,66.356c0,10.722,2.561,20.856,7.096,29.828l59.262,122.21l59.271-122.229
              c4.526-8.969,7.084-19.096,7.084-29.81C413.337,60.846,383.569,31.078,346.981,31.078z M346.981,134.157
              c-20.248,0-36.725-16.475-36.725-36.722c0-20.248,16.477-36.722,36.725-36.722c20.246,0,36.722,16.474,36.722,36.722
              C383.702,117.682,367.228,134.157,346.981,134.157z"/>
                        </g>
                    </svg>
                    <div>
                        <p className={ 'about-app-title' }>{ AppConstants.appInfo.title }</p>
                        <p className={ 'about-app-company' }>{ AppConstants.appInfo.companyName }</p>
                        <p>Все права сохранены.</p>
                    </div>
                </div>
                <div>
                    <p>ООО КФ { AppConstants.appInfo.companyName }</p>
                    <p>420124, г. Казань, ул. Меридианная, д.6</p>
                    <p>тел./факс +7(843)211–10–10</p>
                    <p>E-mail: kazan@ic-eta.ru</p>
                </div>
            </div>
        </div>
    </>
);
