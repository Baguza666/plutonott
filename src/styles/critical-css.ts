/**
 * Critical CSS injected into <head> for fast LCP and zero CLS.
 * Colors match design tokens in globals.css — keep in sync.
 * Target: < 8 KB uncompressed.
 */
export const CRITICAL_CSS = `
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #1E293B;
}
html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  -moz-tab-size: 4;
  tab-size: 4;
  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
}
body {
  margin: 0;
  line-height: inherit;
  background-color: #050505;
  color: #F8FAFC;
}
:focus-visible {
  outline: 2px solid #06b6d4;
  outline-offset: 2px;
}
header { min-height: 64px; }
.hero-placeholder { min-height: 400px; background: #090E1B; }
.sticky-cta-placeholder { min-height: 80px; }
img {
  max-width: 100%;
  height: auto;
  display: block;
}
`;
