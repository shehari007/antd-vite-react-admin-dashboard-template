import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Empty, Input, Modal, Typography, theme } from 'antd';
import {
  BgColorsOutlined,
  BulbOutlined,
  ExportOutlined,
  FileTextOutlined,
  LogoutOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getSearchablePages } from '@/layout/navConfig';
import { useAuth } from '@/context/useAuth';
import { useThemeMode } from '@/context/useThemeMode';

const { Text } = Typography;

/**
 * Ctrl+K search across every page in the navigation tree, plus a few actions.
 *
 * The page list comes from navConfig, filtered by the current role, so a new
 * entry there is searchable immediately with nothing to register here.
 */
const CommandPalette = ({ open, onClose, onOpenCustomizer }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { hasRole, signOut } = useAuth();
  const { toggleMode } = useThemeMode();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const {
    token: { colorFillTertiary, colorTextTertiary, colorPrimary, borderRadius },
  } = theme.useToken();

  const results = useMemo(() => {
    const pages = getSearchablePages(t, hasRole).map((page) => ({ ...page, kind: 'page' }));
    const actions = [
      {
        key: 'action:theme',
        kind: 'action',
        label: t('command.toggleTheme'),
        group: t('command.actions'),
        icon: <BulbOutlined />,
        run: toggleMode,
      },
      {
        key: 'action:customizer',
        kind: 'action',
        label: t('command.openCustomizer'),
        group: t('command.actions'),
        icon: <BgColorsOutlined />,
        run: onOpenCustomizer,
      },
      {
        key: 'action:signout',
        kind: 'action',
        label: t('command.signOut'),
        group: t('command.actions'),
        icon: <LogoutOutlined />,
        run: async () => {
          await signOut();
          navigate('/signin');
        },
      },
    ];

    const term = query.trim().toLowerCase();
    const matches = (item) =>
      !term || item.label.toLowerCase().includes(term) || item.group.toLowerCase().includes(term);

    return [...pages, ...actions].filter(matches);
  }, [query, t, hasRole, toggleMode, onOpenCustomizer, signOut, navigate]);

  /* Adjusting state during render rather than in an effect. This is React's
     recommended shape for state that has to follow another value, and it avoids
     the extra render pass an effect would cost on every keystroke. */
  const [trackedQuery, setTrackedQuery] = useState(query);
  if (query !== trackedQuery) {
    setTrackedQuery(query);
    setActiveIndex(0);
  }

  // Keep the highlighted row visible while arrowing through a long list.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  // Clearing on close rather than in an effect keeps the reset in the one place
  // that actually closes the palette.
  const close = () => {
    setQuery('');
    setActiveIndex(0);
    onClose();
  };

  const runItem = (item) => {
    close();
    if (item.kind === 'action') {
      item.run();
      return;
    }
    if (item.external) {
      window.open(item.to, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(item.to);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault();
      runItem(results[activeIndex]);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      footer={null}
      closable={false}
      destroyOnHidden
      width={560}
      style={{ top: 88 }}
      title={null}
      aria-label={t('command.title')}
      styles={{ body: { padding: 0 } }}
    >
      <Input
        /* The rule exists to stop a page stealing focus on load. Moving focus
           into a dialog the user just opened is the opposite: a search dialog
           the user has to click into before typing is the accessibility
           problem. */
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        size="large"
        variant="borderless"
        prefix={<SearchOutlined style={{ color: colorTextTertiary }} />}
        placeholder={t('command.placeholder')}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        aria-label={t('command.placeholder')}
      />

      <div
        ref={listRef}
        role="listbox"
        aria-label={t('command.title')}
        style={{
          maxHeight: 360,
          overflowY: 'auto',
          padding: 8,
          borderTop: `1px solid ${colorFillTertiary}`,
        }}
      >
        {results.length === 0 && (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('command.empty')} />
        )}

        {results.map((item, index) => (
          <button
            key={item.key}
            type="button"
            data-index={index}
            role="option"
            aria-selected={index === activeIndex}
            onClick={() => runItem(item)}
            onMouseEnter={() => setActiveIndex(index)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 12px',
              border: 0,
              borderRadius,
              cursor: 'pointer',
              textAlign: 'start',
              background: index === activeIndex ? colorFillTertiary : 'transparent',
              color: 'inherit',
              font: 'inherit',
            }}
          >
            <span style={{ color: colorPrimary, display: 'flex' }}>
              {item.icon || <FileTextOutlined />}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>{item.label}</span>
            {item.external && <ExportOutlined style={{ fontSize: 11, opacity: 0.5 }} />}
            <Text type="secondary" style={{ fontSize: 12 }}>
              {item.group}
            </Text>
          </button>
        ))}
      </div>

      <div style={{ padding: '8px 14px', borderTop: `1px solid ${colorFillTertiary}` }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('command.hint')}
        </Text>
      </div>
    </Modal>
  );
};

export default CommandPalette;
