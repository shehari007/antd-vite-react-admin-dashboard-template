import { Link } from 'react-router-dom';
import logoIcon from '../assets/logo/logo-icon.png';

/* Only logo-icon.png is used. The four "prepared" assets all bake in an opaque
 * background (the -dark pair is a navy gradient that cannot be matched to
 * SIDER_BG, the -light pair is white), so each would paint a visible plate on
 * the rail. They remain correct for light surfaces — README, auth pages.
 *
 * Padding and justification are identical in both states, so the 32px mark is
 * geometrically immobile during collapse: its centre sits on the 40px axis
 * either way (24px inset + half of 32). Only the wordmark fades. */
const LayoutLogo = () => (
  <Link to="/dashboard/home" className="app-sider__brand" aria-label="ViteDash — Home">
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
