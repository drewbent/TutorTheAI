const PROD = (process.env.NODE_ENV === 'production');

exports.RECAPTCHA_SITE_KEY = (PROD
  ? '6Ld6_rsZAAAAAC3c29oLL0UGBo76jUTCjj4R66-u'
  : '6LeA6rsZAAAAAMc1RSz3gl5oxXRbL2ALzJr5e-Ah'
);