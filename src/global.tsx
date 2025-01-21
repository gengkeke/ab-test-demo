import {useIntl} from '@umijs/max';
import {Button, message, notification} from 'antd';
import defaultSettings from '../config/defaultSettings';
import hinaSdk from 'hina-cloud-js-sdk';

const { pwa } = defaultSettings;
const isHttps = document.location.protocol === 'https:';

const clearCache = () => {
  // remove all caches
  if (window.caches) {
    caches
      .keys()
      .then((keys) => {
        keys.forEach((key) => {
          caches.delete(key);
        });
      })
      .catch((e) => console.log(e));
  }
};

// if pwa is true
if (pwa) {
  // Notify user if offline now
  window.addEventListener('sw.offline', () => {
    message.warning(useIntl().formatMessage({ id: 'app.pwa.offline' }));
  });

  // Pop up a prompt on the page asking the user if they want to use the latest version
  window.addEventListener('sw.updated', (event: Event) => {
    const e = event as CustomEvent;
    const reloadSW = async () => {
      // Check if there is sw whose state is waiting in ServiceWorkerRegistration
      // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration
      const worker = e.detail && e.detail.waiting;
      if (!worker) {
        return true;
      }
      // Send skip-waiting event to waiting SW with MessageChannel
      await new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = (msgEvent) => {
          if (msgEvent.data.error) {
            reject(msgEvent.data.error);
          } else {
            resolve(msgEvent.data);
          }
        };
        worker.postMessage({ type: 'skip-waiting' }, [channel.port2]);
      });

      clearCache();
      window.location.reload();
      return true;
    };
    const key = `open${Date.now()}`;
    const btn = (
      <Button
        type="primary"
        onClick={() => {
          notification.destroy(key);
          reloadSW();
        }}
      >
        {useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.ok' })}
      </Button>
    );
    notification.open({
      message: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated' }),
      description: useIntl().formatMessage({ id: 'app.pwa.serviceworker.updated.hint' }),
      btn,
      key,
      onClose: async () => null,
    });
  });
} else if ('serviceWorker' in navigator && isHttps) {
  // unregister service worker
  const { serviceWorker } = navigator;
  if (serviceWorker.getRegistrations) {
    serviceWorker.getRegistrations().then((sws) => {
      sws.forEach((sw) => {
        sw.unregister();
      });
    });
  }
  serviceWorker.getRegistration().then((sw) => {
    if (sw) sw.unregister();
  });

  clearCache();
}

//海纳sdk初始化
hinaSdk.init({
  serverUrl: 'http://10.254.121.158:8088/gateway/hina-cloud-engine/gather?project=new_category&token=ui5scybH',
  autoTrackConfig: {
    clickAutoTrack: false,
    stayAutoTrack: false
  },
  showLog: true,
})

//const uid = Math.floor(Math.random() * 100000000000);
const uid = [13146580599,
  77923057356,
  67974048733,
  79155018307,
  64078581843,
  17620341824,
  20862774751,
  90174365168,
  58570267359,
  99752370649,
  3055642871,
  1344012262,
  30270901053,
  84828463503,
  59823003439,
  3180355499,
  42525700840,
  39105843425,
  71525765583,
  87491035230,
  57267381143,
  69979440584,
  33267356407,
  39160251050,
  56882739052,
  74057982909,
  67716156441,
  49918602982,
  93577014842,
  73627353352,
  81412012239,
  47028886885,
  46326220541,
  23462237526,
  95320441341,
  15265816617,
  22494239710,
  14802126827,
  25062936424,
  48227332463,
  43369468795,
  10562193605,
  49340186158,
  60112760788,
  65326162431,
  49331384745,
  75864567566,
  818734223,
  79005885046,
  64440864825,
  6613994056 ,
  34156798464,
  77374509367,
  79651249133,
  63670011392,
  62277934334,
  19444629589,
  81172167112,
  39175799827,
  66816170322,
  23040517236,
  68985416287,
  58457769781,
  74381395958,
  21117261569,
  96819973287,
  20818737491,
  88283680977,
  32485310933,
  38298674188,
  59784070949,
  66080274385,
  50177624005,
  18638665531,
  55287322168,
  38413592619,
  27102478064,
  83852313831,
  61458341237,
  37696709911,
  90028802987,
  67570958192,
  70062553051,
  12092270398,
  46917612740,
  75096264113,
  72582192983,
  18817378381].sort(() => Math.random() - 0.5)[0];

hinaSdk.setUserUId(uid);
hinaSdk.setDeviceUId('' + uid);
// 将 SDK 实例赋给全局变量 hina
window["hina"] = hinaSdk;

const abTest = hinaSdk.use('HinaABTest', {
  url: '/gateway/hina-cloud-service/abm/divide/query?project-key=ui5scybH',

});

window['abTest'] = abTest;
window["hina"].track('H_SignUp', {});
