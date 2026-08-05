import { Layout, Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import LayoutLogo from './LayoutLogo';
import LayoutMenu from './LayoutMenu';
import LayoutUserCard from './LayoutUserCard';
import { SIDER_BG, SIDER_COLLAPSED_WIDTH, SIDER_WIDTH } from '@/context/theme-mode-context';
import { useThemeMode } from '@/context/useThemeMode';

const { Sider } = Layout;

const LayoutSidebar = ({
  collapsed,
  isMobile,
  isTablet,
  navOpen,
  onClose,
  selectedKey,
  activeRootKey,
  openKeys,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const { direction } = useThemeMode();

  const nav = (
    <nav className="app-sider__inner" aria-label={t('nav.mainNav')}>
      <LayoutLogo />
      <div className="app-sider__scroll">
        <LayoutMenu
          selectedKey={selectedKey}
          activeRootKey={activeRootKey}
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          onItemClick={isMobile ? onClose : undefined}
        />
      </div>
      <LayoutUserCard collapsed={collapsed} />
    </nav>
  );

  if (isMobile) {
    return (
      <Drawer
        // Drawer placement is physical, not logical, so it has to be flipped
        // by hand for a right to left language.
        placement={direction === 'rtl' ? 'right' : 'left'}
        // `isMobile &&` is the belt to MainLayout's braces: a stale navOpen can
        // never render an open drawer for even one frame after a resize.
        open={isMobile && navOpen}
        onClose={onClose}
        size={SIDER_WIDTH}
        rootClassName="app-drawer"
        aria-label={t('nav.mainNav')}
        closable
        closeIcon={<span aria-hidden="true">&times;</span>}
        styles={{
          body: { padding: 0, background: SIDER_BG },
          header: { background: SIDER_BG, borderBottom: 0 },
        }}
      >
        {nav}
      </Drawer>
    );
  }

  return (
    <>
      <Sider
        id="app-sidebar"
        className="app-sider app-shell"
        trigger={null}
        width={SIDER_WIDTH}
        collapsedWidth={SIDER_COLLAPSED_WIDTH}
        collapsed={collapsed}
      >
        {nav}
      </Sider>
      {/* Tablet expands as an overlay rather than reflowing the content column,
          which keeps a mid rotation device from a reflow storm. */}
      {isTablet && navOpen && (
        <div className="app-sider__scrim" onClick={onClose} role="presentation" />
      )}
    </>
  );
};

export default LayoutSidebar;
