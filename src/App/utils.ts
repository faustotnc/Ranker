export const calculateTrueViewportHeight = () => {
   // First we get the viewport height and we multiply it by 1% to get a value for one vh unit
   const vh = document.documentElement.clientHeight * 0.01;
   // Then we set the value in the --vh custom property to the root of the document
   document.body.style.setProperty("--vh", `${vh}px`);
};

export const getQueryStringParams = () => {
   let raw = window.location.search;
   let qs = /^[?#]/.test(raw) ? raw.slice(1) : raw;

   let params: { [key: string]: any } = {};
   qs.split("&").forEach((param) => {
      let [key, value] = param.split("=");
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, " ")) : "";
   });

   return params;
};

// source: https://www.w3schools.com/js/js_cookies.asp
export const getCookie = (cname: string) => {
   let name = cname + "=";
   let decodedCookie = decodeURIComponent(document.cookie);
   let ca = decodedCookie.split(";");

   for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === " ") {
         c = c.substring(1);
      }

      if (c.indexOf(name) === 0) {
         return c.substring(name.length, c.length);
      }
   }

   return "";
};
