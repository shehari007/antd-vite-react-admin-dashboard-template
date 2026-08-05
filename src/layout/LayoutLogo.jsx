import { Link } from 'react-router-dom';
import logoIcon from '@/assets/logo/logo-icon.png';
import { APP_NAME } from '@/config/appInfo';

/* Only logo-icon.png is used. The four "prepared" assets all bake in an opaque
 * background (the -dark pair is a navy gradient that cannot be matched to
 * SIDER_BG, the -light pair is white), so each would paint a visible plate on
 * the rail. They remain correct for light surfaces such as the README and the
 * auth pages.
 *
 * Padding and justification are identical in both states, so the 32px mark is
 * geometrically immobile during collapse: its centre sits on the 40px axis
 * either way (24px inset plus half of 32). Only the wordmark fades. */
const LayoutLogo = () => (
  <Link to="/dashboard/home" className="app-sider__brand" aria-label={`${APP_NAME}, home`}>
    <span className="app-sider__mark">
      <img src={logoIcon} alt="" width={28} height={28} />
    </span>
    <span className="app-sider__wordmark">
      <b>Vite</b>
      <i>Dash</i>
    </span>
  </Link>
);

export default LayoutLogo;
