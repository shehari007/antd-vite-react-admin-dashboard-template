import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Layout, theme, Grid } from 'antd';
import LayoutFooter from './LayoutFooter';
import LayoutHeader from './LayoutHeader';
import LayoutSidebar from './LayoutSidebar';
import { findOpenPath, getSelectedKey, ROOT_KEYS } from './navConfig';
import { SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from '../context/theme-mode-context';

const { Content } = Layout;
const { useBreakpoint } = Grid;

const COLLAPSE_KEY = 'dashboard-sider-collapsed';

/* useBreakpoint starts from an empty screens object and only fills it in a
 * layout effect, so without a seed the first render of a 2560px desktop
 * evaluates as mobile — mounting and immediately tearing down the Drawer, and
 * remounting the whole menu, on every page load. */
const initialScreens =
  typeof window === 'undefined'
    ? undefined
    : {
        xs: window.innerWidth < 576,
        sm: window.innerWidth >= 576,
        md: window.innerWidth >= 768,
        lg: window.innerWidth >= 992,
        xl: window.innerWidth >= 1200,
        xxl: window.innerWidth >= 1600,
      };

const getContentPadding = (screens) => {
  if (screens.xl) return '32px 40px';
  if (screens.md) return '24px 32px';
  if (screens.sm) return '20px 24px';
  return '16px';
};

const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === 'true';
  } catch {
    return false;
  }
};

const MainLayout = ({ children }) => {
  const { pathname } = useLocation();
  const screens = useBreakpoint(true, initialScreens);
  const scrollRef = useRef(null);

  const isMobile = !screens.md; // < 768
  const isTablet = !!screens.md && !screens.lg; // 768 – 991
  const isDesktop = !!screens.lg; // >= 992

  // Desktop intent, persisted. Read in the initializer so there is no
  // post-mount layout jump.
  const [collapsed, setCollapsed] = useState(readCollapsed);
  // Ephemeral, covers both the mobile drawer and the tablet overlay.
  const [navOpen, setNavOpen] = useState(false);

  const selectedKey = getSelectedKey(pathname);
  // Two separate open states. `openKeys` is the expanded tree's memory and has
  // to survive a collapse; `popupKeys` is the collapsed rail's hover state and
  // has to change freely. They cannot be one value: rc-menu reads popup
  // visibility from the same controlled openKeys prop, so holding that steady
  // to protect the tree would pin a flyout permanently open.
  const [openKeys, setOpenKeys] = useState(() => findOpenPath(getSelectedKey(pathname)) || []);
  const [popupKeys, setPopupKeys] = useState([]);
  // Collapsed, the rail cannot see which section owns the route from the DOM
  // alone — the children live in a portaled flyout.
  const activeRootKey = findOpenPath(selectedKey)?.[0];

  const siderCollapsed = isDesktop ? collapsed : !navOpen;
  const navExpanded = isDesktop ? !collapsed : navOpen;

  const {
    token: { colorBgLayout },
  } = theme.useToken();

  useEffect(() => {
    try {
      localStorage.setItem(COLLAPSE_KEY, String(collapsed));
    } catch {
      /* private mode — the rail just won't remember */
    }
  }, [collapsed]);

  /* The three blocks below adjust state during render rather than in an effect.
     That is React's recommended shape for state that has to follow a derived
     value, and it avoids the cascading re-render an effect would cause. */

  // An overlay nav must never outlive the mode that created it.
  const mode = isDesktop ? 'desktop' : isTablet ? 'tablet' : 'mobile';
  const [trackedMode, setTrackedMode] = useState(mode);
  if (mode !== trackedMode) {
    setTrackedMode(mode);
    if (navOpen) setNavOpen(false);
  }

  const [trackedKey, setTrackedKey] = useState(selectedKey);
  if (selectedKey !== trackedKey) {
    setTrackedKey(selectedKey);
    if (!isDesktop && navOpen) setNavOpen(false);
    // Follow the route, but only ever open a group — never slam one shut.
    const path = findOpenPath(selectedKey);
    if (path && !path.every((key) => openKeys.includes(key))) setOpenKeys(path);
  }

  // Restore the route's group when the rail re-expands.
  const [trackedCollapsed, setTrackedCollapsed] = useState(siderCollapsed);
  if (siderCollapsed !== trackedCollapsed) {
    setTrackedCollapsed(siderCollapsed);
    // Never carry a hovered flyout across a state change.
    if (popupKeys.length) setPopupKeys([]);
    if (!siderCollapsed) setOpenKeys(findOpenPath(selectedKey) || []);
  }

  // The scroll container is a div, not the window, so native scroll
  // restoration is inert. useLayoutEffect so the reset lands before paint.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0 });
  }, [pathname]);

  const handleOpenChange = (keys) => {
    // Collapsed, these are hover events on the flyouts. They drive popupKeys
    // only, so the expanded tree's openKeys is untouched — including by the
    // onOpenChange([]) that rc-menu fires when it flips inline to vertical,
    // which is what used to wipe the open group so it never came back.
    if (siderCollapsed) {
      setPopupKeys(keys);
      return;
    }
    const latest = keys.find((key) => !openKeys.includes(key));
    setOpenKeys(ROOT_KEYS.includes(latest) ? [latest] : keys);
  };

  const toggleNav = () => {
    if (isDesktop) setCollapsed((value) => !value);
    else setNavOpen((open) => !open);
  };

  const contentOffset = isMobile
    ? 0
    : isTablet
      ? SIDER_COLLAPSED_WIDTH // the rail overlays when opened; content never reflows
      : collapsed
        ? SIDER_COLLAPSED_WIDTH
        : SIDER_WIDTH;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <LayoutSidebar
        collapsed={siderCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        navOpen={navOpen}
        onClose={() => setNavOpen(false)}
        selectedKey={selectedKey}
        activeRootKey={activeRootKey}
        openKeys={siderCollapsed ? popupKeys : openKeys}
        onOpenChange={handleOpenChange}
      />
      <Layout
        ref={scrollRef}
        className="app-shell app-content-shell"
        style={{
          marginLeft: contentOffset,
          overflow: 'auto',
          background: colorBgLayout,
        }}
      >
        <LayoutHeader navExpanded={navExpanded} toggleSidebar={toggleNav} isMobile={isMobile} />
        <Content
          style={{
            padding: getContentPadding(screens),
            flex: '1 0 auto',
            width: '100%',
            maxWidth: 1800,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: '1 1 auto', minHeight: 0 }}>{children}</div>
        </Content>
        <LayoutFooter />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
