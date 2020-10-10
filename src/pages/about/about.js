import React from "react";
import appInfo from "../../app-info";

import "./about.scss";

export default () => (
  <React.Fragment>
    <h2 className={"content-block"}>О программе</h2>
    <div className={"content-block"}>
      <div className={"dx-card responsive-paddings"}>
        <div className={'about-app-info'}>
          <p className={'about-app-title'}>{appInfo.title}</p>
          <p className={'about-app-company'}>{appInfo.companyName}</p>
          <p>Все права сохранены.</p>
        </div>
        <div>
          <p>ООО КФ «{appInfo.companyName}»©</p>
          <p>420124, г. Казань, ул. Меридианная, д.6</p>
          <p>тел./факс +7(843)211–10–10</p>
          <p>E-mail: kazan@ic-eta.ru</p>
        </div>
      </div>
    </div>
  </React.Fragment>
);
