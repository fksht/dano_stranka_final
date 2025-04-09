const routes = [
  {
    path: "/index.html",
    target: "router-view",
    getTemplate: (targetElm) => {
      document.getElementById(targetElm).innerHTML = document.getElementById("template-welcome").innerHTML;
      document.getElementById('slider-container').style.display = 'block';
    }
  },
  {
    path: "/o-mne",
    target: "router-view",
    getTemplate: (targetElm) => {
      document.getElementById(targetElm).innerHTML = document.getElementById("template-article1").innerHTML;
      document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/sluzby",
    target: "router-view",
    getTemplate: (targetElm) => {
      document.getElementById(targetElm).innerHTML = document.getElementById("template-article2").innerHTML;
      document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/kontakt",
    target: "router-view",
    getTemplate: (targetElm) => {
      document.getElementById(targetElm).innerHTML = document.getElementById("template-article3").innerHTML;
      document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/cennik",
    target: "router-view",
    getTemplate: (targetElm) => {
      document.getElementById(targetElm).innerHTML = document.getElementById("template-cennik").innerHTML;
      document.getElementById('slider-container').style.display = 'none';
    }
  }
];

export default routes;