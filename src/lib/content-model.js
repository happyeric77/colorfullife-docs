import { usePluginData } from '@docusaurus/useGlobalData';

const PLUGIN_NAME = 'colorfullife-content-model';

/**
 * Aggregated Project / Journal / Topic metadata collected at build time by
 * plugins/content-model. Shape: { projects, journal, topics }.
 */
export function useContentModel() {
  return usePluginData(PLUGIN_NAME);
}
