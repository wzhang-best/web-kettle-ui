/* eslint semi: ["error", "always"] */
import mx from 'mxgraph';

const mxgraph = mx({
  mxImageBasePath: `/${window.SITE_CONFIG.cdnUrl}/static/studio/plugins/mxgraph/images`,
  mxBasePath: `/${window.SITE_CONFIG.cdnUrl}/static/studio/plugins/mxgraph`
  // mxImageBasePath: './src/images',
  // mxBasePath: './src'
});

// decode bug https://github.com/jgraph/mxgraph/issues/49
window.mxGraph = mxgraph.mxGraph;
window.mxGraphModel = mxgraph.mxGraphModel;
window.mxEditor = mxgraph.mxEditor;
window.mxGeometry = mxgraph.mxGeometry;
window.mxDefaultKeyHandler = mxgraph.mxDefaultKeyHandler;
window.mxDefaultPopupMenu = mxgraph.mxDefaultPopupMenu;
window.mxStylesheet = mxgraph.mxStylesheet;
window.mxDefaultToolbar = mxgraph.mxDefaultToolbar;
window.mxPoint = mxgraph.mxPoint;
window.mxUtils = mxgraph.mxUtils;

export default mxgraph;
