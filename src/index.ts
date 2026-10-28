import { regPluginColorScheme, sharedEvent } from '@capital/common';

regPluginColorScheme({ label: '流光玻璃(亮色)', name: 'light+aurora' });
regPluginColorScheme({ label: '流光玻璃(暗色)', name: 'dark+aurora' });

sharedEvent.on('loadColorScheme', (colorSchemeName: string) => {
  if (colorSchemeName === 'light+aurora' || colorSchemeName === 'dark+aurora') {
    import('./theme.less');
  }
});
