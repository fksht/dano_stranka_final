const routes = [
  {
    path: "/",
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
  },
  {
    path: "/triatlon_info",
    target: "router-view",
    getTemplate: (targetElm) => {
        document.getElementById(targetElm).innerHTML = document.getElementById("triatlon_info").innerHTML;
        document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/beh_info",
    target: "router-view",
    getTemplate: (targetElm) => {
        document.getElementById(targetElm).innerHTML = document.getElementById("beh_info").innerHTML;
        document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/plavanie_info",
    target: "router-view",
    getTemplate: (targetElm) => {
        document.getElementById(targetElm).innerHTML = document.getElementById("plavanie_info").innerHTML;
        document.getElementById('slider-container').style.display = 'none';
    }
  },
  {
    path: "/bezky_info",
    target: "router-view",
    getTemplate: (targetElm) => {
        document.getElementById(targetElm).innerHTML = document.getElementById("bezky_info").innerHTML;
        document.getElementById('slider-container').style.display = 'none';
    }
  },
];

export default routes;