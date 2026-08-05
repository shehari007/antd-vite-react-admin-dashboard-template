import { useMemo } from 'react';
import { Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { SIDER_INLINE_INDENT } from '@/context/theme-mode-context';
import { buildNavItems, getSectionLabels } from './navConfig';
import { useAuth } from '@/context/useAuth';

const LayoutMenu = ({ selectedKey, activeRootKey, openKeys, onOpenChange, onItemClick }) => {
  const { t } = useTranslation();
  const { hasRole } = useAuth();

  // Rebuilt when the language or the role changes, not on every render.
  const items = useMemo(
    () => buildNavItems(t, { activeRootKey, hasRole }),
    [t, activeRootKey, hasRole]
  );
  const sectionLabels = useMemo(() => getSectionLabels(t), [t]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      items={items}
      className="app-nav"
      classNames={{ popup: { root: 'app-flyout' } }}
      // The geometry primitive. A token cannot do this job: rc-menu writes
      // padding-left as an inline style, which beats itemPaddingInline.
      inlineIndent={SIDER_INLINE_INDENT}
      selectedKeys={selectedKey ? [selectedKey] : []}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      onClick={onItemClick}
      popupRender={(node, { keys }) => (
        <div className="app-flyout__panel">
          <div className="app-flyout__title">{sectionLabels[keys[keys.length - 1]]}</div>
          {node}
        </div>
      )}
      style={{ borderInlineEnd: 0, background: 'transparent' }}
    />
  );
};

export default LayoutMenu;
