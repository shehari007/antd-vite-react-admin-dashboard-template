import { Button, Drawer, Divider, Segmented, Space, Tooltip, Typography, theme } from 'antd';
import { CheckOutlined, MoonOutlined, SunOutlined, UndoOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '@/context/useThemeMode';
import { PRIMARY_PRESETS, RADIUS_PRESETS } from '@/context/theme-mode-context';
import { LANGUAGES } from '@/i18n';

const { Text, Title } = Typography;

const Section = ({ label, children }) => (
  <div style={{ marginBottom: 24 }}>
    <Text strong style={{ display: 'block', marginBottom: 10 }}>
      {label}
    </Text>
    {children}
  </div>
);

/**
 * Live theme controls, behind the paintbrush in the header.
 *
 * Everything here writes to the same context that feeds ConfigProvider, so a
 * change is a single re-render rather than a stylesheet swap, and it survives a
 * reload through localStorage.
 */
const ThemeCustomizer = ({ open, onClose }) => {
  const { t } = useTranslation();
  const {
    mode,
    setMode,
    primaryColor,
    setPrimaryColor,
    borderRadius,
    setBorderRadius,
    compact,
    setCompact,
    language,
    setLanguage,
    resetTheme,
  } = useThemeMode();

  const {
    token: { colorBorderSecondary },
  } = theme.useToken();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      size={320}
      title={
        <Space orientation="vertical" size={0}>
          <Title level={5} style={{ margin: 0 }}>
            {t('customizer.title')}
          </Title>
          <Text type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
            {t('customizer.subtitle')}
          </Text>
        </Space>
      }
      extra={
        <Tooltip title={t('customizer.reset')}>
          <Button icon={<UndoOutlined />} onClick={resetTheme} aria-label={t('customizer.reset')} />
        </Tooltip>
      }
    >
      <Section label={t('customizer.mode')}>
        <Segmented
          block
          value={mode}
          onChange={setMode}
          options={[
            { value: 'light', label: t('customizer.light'), icon: <SunOutlined /> },
            { value: 'dark', label: t('customizer.dark'), icon: <MoonOutlined /> },
          ]}
        />
      </Section>

      <Section label={t('customizer.primary')}>
        <Space size={10} wrap>
          {PRIMARY_PRESETS.map((preset) => {
            const selected = preset.color.toLowerCase() === primaryColor.toLowerCase();
            return (
              <Tooltip key={preset.key} title={preset.name}>
                <button
                  type="button"
                  onClick={() => setPrimaryColor(preset.color)}
                  aria-label={preset.name}
                  aria-pressed={selected}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: preset.color,
                    border: `2px solid ${selected ? colorBorderSecondary : 'transparent'}`,
                    outlineOffset: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                  }}
                >
                  {selected && <CheckOutlined aria-hidden="true" />}
                </button>
              </Tooltip>
            );
          })}
        </Space>
      </Section>

      <Section label={t('customizer.radius')}>
        <Segmented
          block
          value={borderRadius}
          onChange={setBorderRadius}
          options={RADIUS_PRESETS.map((radius) => ({ value: radius, label: String(radius) }))}
        />
      </Section>

      <Section label={t('customizer.density')}>
        <Segmented
          block
          value={compact ? 'compact' : 'comfortable'}
          onChange={(value) => setCompact(value === 'compact')}
          options={[
            { value: 'comfortable', label: t('customizer.comfortable') },
            { value: 'compact', label: t('customizer.compact') },
          ]}
        />
      </Section>

      <Divider />

      <Section label={t('customizer.language')}>
        <Segmented
          block
          value={language}
          onChange={setLanguage}
          options={LANGUAGES.map((item) => ({ value: item.code, label: item.shortLabel }))}
        />
        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 8 }}>
          {LANGUAGES.find((item) => item.code === language)?.label}
        </Text>
      </Section>
    </Drawer>
  );
};

export default ThemeCustomizer;
