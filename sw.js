'use strict';

// The service worker of the web build. build.ps1 copies this file to
// build/web/sw.js and fills in the three placeholders (the cache version and
// the two file lists) from what `flutter build web` produced; it is not used
// as it stands (there is no service worker when running from source).

// The prefix names where this build is served from (build.ps1 derives it from
// -BaseHref), so builds on one site do not touch each other's cache. The
// version changes on every build — forces old caches to be replaced.
const CACHE_PREFIX = 'aw139pac';
const CACHE = CACHE_PREFIX + '-20261120191146';
// Only this build's own earlier caches (prefix, a dash, the 14-digit stamp):
// another build's name can start with this prefix, but never matches this.
const OWN_OLD_CACHE = new RegExp('^' + CACHE_PREFIX + '-[0-9]{14}$');

// Eagerly pre-cached on install — the app shell only, so the menu shows as
// fast as possible. Everything else is either filled in slowly afterward
// (BACKGROUND, below) or left purely on-demand via the fetch handler
// (CanvasKit's renderer variants — only one of the 5 is ever actually used).
const PRECACHE = [
  './.last_build_id',
  './favicon.png',
  './flutter.js',
  './flutter.js.map',
  './flutter_bootstrap.js?v=20261120191146',
  './flutter_service_worker.js',
  './index.html',
  './main.dart.js?v=20261120191146',
  './manifest.json',
  './version.json',
  './assets/AssetManifest.bin',
  './assets/AssetManifest.bin.json',
  './assets/FontManifest.json',
  './assets/assets/fonts/Roboto-Bold.ttf',
  './assets/assets/fonts/Roboto-Light.ttf',
  './assets/assets/fonts/Roboto-Medium.ttf',
  './assets/assets/fonts/Roboto-Regular.ttf',
  './assets/fonts/MaterialIcons-Regular.otf',
  './assets/packages/cupertino_icons/assets/CupertinoIcons.ttf',
  './assets/packages/material_design_icons_flutter/lib/fonts/materialdesignicons-webfont.ttf',
  './assets/packages/material_ui/shaders/ink_sparkle.frag',
  './assets/shaders/ink_sparkle.frag',
  './assets/shaders/stretch_effect.frag',
  './icons/Icon-192.png',
  './icons/Icon-512.png',
  './icons/Icon-maskable-192.png',
  './icons/Icon-maskable-512.png',
  './icons/maskable_icon_x128.png',
  './icons/maskable_icon_x192.png',
  './icons/maskable_icon_x384.png',
  './icons/maskable_icon_x48.png',
  './icons/maskable_icon_x512.png',
  './icons/maskable_icon_x72.png',
  './icons/maskable_icon_x96.png'
];

// Not needed for first paint — filled in one file at a time by
// backgroundPrecache() below, well after the shell is ready, so it never
// competes with (or delays) whatever the user is actively using right now.
const BACKGROUND = [
  './assets/assets/aw139_pwr_ass_icon.png',
  './assets/assets/BleedValveGraph.jpg',
  './assets/assets/BleedValveGraph.png',
  './assets/assets/path163-4.jpg',
  './assets/assets/performanceTables.json',
  './assets/assets/s-97-35.svg',
  './assets/assets/s50-63.jpg',
  './assets/assets/s50-63.json',
  './assets/assets/s50-63_chartBounds.json',
  './assets/assets/s69-63.jpg',
  './assets/assets/s69-63.json',
  './assets/assets/s69-63_chartBounds.json',
  './assets/assets/S97-35.jpg',
  './assets/assets/s97-35.json',
  './assets/assets/s97-35_chartBounds.json',
  './assets/assets/cat_a/cat_a_data.json',
  './assets/assets/cat_a/pages/page_1001.jpg',
  './assets/assets/cat_a/pages/page_1002.jpg',
  './assets/assets/cat_a/pages/page_1003.jpg',
  './assets/assets/cat_a/pages/page_1004.jpg',
  './assets/assets/cat_a/pages/page_1005.jpg',
  './assets/assets/cat_a/pages/page_1007.jpg',
  './assets/assets/cat_a/pages/page_1017.jpg',
  './assets/assets/cat_a/pages/page_1041.jpg',
  './assets/assets/cat_a/pages/page_1054.jpg',
  './assets/assets/cat_a/pages/page_1055.jpg',
  './assets/assets/cat_a/pages/page_1056.jpg',
  './assets/assets/cat_a/pages/page_1057.jpg',
  './assets/assets/cat_a/pages/page_1059.jpg',
  './assets/assets/cat_a/pages/page_1061.jpg',
  './assets/assets/cat_a/pages/page_1063.jpg',
  './assets/assets/cat_a/pages/page_1064.jpg',
  './assets/assets/cat_a/pages/page_1065.jpg',
  './assets/assets/cat_a/pages/page_1066.jpg',
  './assets/assets/cat_a/pages/page_1067.jpg',
  './assets/assets/cat_a/pages/page_1068.jpg',
  './assets/assets/cat_a/pages/page_1069.jpg',
  './assets/assets/cat_a/pages/page_1070.jpg',
  './assets/assets/cat_a/pages/page_1071.jpg',
  './assets/assets/cat_a/pages/page_1072.jpg',
  './assets/assets/cat_a/pages/page_1073.jpg',
  './assets/assets/cat_a/pages/page_1074.jpg',
  './assets/assets/cat_a/pages/page_1075.jpg',
  './assets/assets/cat_a/pages/page_1076.jpg',
  './assets/assets/cat_a/pages/page_1077.jpg',
  './assets/assets/cat_a/pages/page_1078.jpg',
  './assets/assets/cat_a/pages/page_1079.jpg',
  './assets/assets/cat_a/pages/page_1080.jpg',
  './assets/assets/cat_a/pages/page_1081.jpg',
  './assets/assets/cat_a/pages/page_1082.jpg',
  './assets/assets/cat_a/pages/page_1083.jpg',
  './assets/assets/cat_a/pages/page_1084.jpg',
  './assets/assets/cat_a/pages/page_1085.jpg',
  './assets/assets/cat_a/pages/page_1086.jpg',
  './assets/assets/cat_a/pages/page_1108.jpg',
  './assets/assets/cat_a/pages/page_1118.jpg',
  './assets/assets/cat_a/pages/page_1119.jpg',
  './assets/assets/cat_a/pages/page_1120.jpg',
  './assets/assets/cat_a/pages/page_1121.jpg',
  './assets/assets/cat_a/pages/page_1123.jpg',
  './assets/assets/cat_a/pages/page_1125.jpg',
  './assets/assets/cat_a/pages/page_1127.jpg',
  './assets/assets/cat_a/pages/page_1129.jpg',
  './assets/assets/cat_a/pages/page_1131.jpg',
  './assets/assets/cat_a/pages/page_1145.jpg',
  './assets/assets/cat_a/pages/page_1150.jpg',
  './assets/assets/cat_a/pages/page_1151.jpg',
  './assets/assets/cat_a/pages/page_1152.jpg',
  './assets/assets/cat_a/pages/page_1153.jpg',
  './assets/assets/cat_a/pages/page_1155.jpg',
  './assets/assets/cat_a/pages/page_1157.jpg',
  './assets/assets/cat_a/pages/page_1159.jpg',
  './assets/assets/cat_a/pages/page_1161.jpg',
  './assets/assets/cat_a/pages/page_1163.jpg',
  './assets/assets/cat_a/pages/page_1165.jpg',
  './assets/assets/cat_a/pages/page_1167.jpg',
  './assets/assets/cat_a/pages/page_1169.jpg',
  './assets/assets/cat_a/pages/page_1171.jpg',
  './assets/assets/cat_a/pages/page_1172.jpg',
  './assets/assets/cat_a/pages/page_1173.jpg',
  './assets/assets/cat_a/pages/page_1174.jpg',
  './assets/assets/cat_a/pages/page_1175.jpg',
  './assets/assets/cat_a/pages/page_1176.jpg',
  './assets/assets/cat_a/pages/page_1177.jpg',
  './assets/assets/cat_a/pages/page_1178.jpg',
  './assets/assets/cat_a/pages/page_1179.jpg',
  './assets/assets/cat_a/pages/page_1180.jpg',
  './assets/assets/cat_a/pages/page_1181.jpg',
  './assets/assets/cat_a/pages/page_1182.jpg',
  './assets/assets/cat_a/pages/page_1183.jpg',
  './assets/assets/cat_a/pages/page_1184.jpg',
  './assets/assets/cat_a/pages/page_1185.jpg',
  './assets/assets/cat_a/pages/page_1186.jpg',
  './assets/assets/cat_a/pages/page_1187.jpg',
  './assets/assets/cat_a/pages/page_1188.jpg',
  './assets/assets/cat_a/pages/page_1189.jpg',
  './assets/assets/cat_a/pages/page_1190.jpg',
  './assets/assets/cat_a/pages/page_1191.jpg',
  './assets/assets/cat_a/pages/page_1192.jpg',
  './assets/assets/cat_a/pages/page_1193.jpg',
  './assets/assets/cat_a/pages/page_1194.jpg',
  './assets/assets/cat_a/pages/page_1219.jpg',
  './assets/assets/cat_a/pages/page_1253.jpg',
  './assets/assets/cat_a/pages/page_1255.jpg',
  './assets/assets/cat_a/pages/page_1303.jpg',
  './assets/assets/cat_a/pages/page_1305.jpg',
  './assets/assets/cat_a/pages/page_1307.jpg',
  './assets/assets/cat_a/pages/page_1309.jpg',
  './assets/assets/cat_a/pages/page_1311.jpg',
  './assets/assets/cat_a/pages/page_1327.jpg',
  './assets/assets/cat_a/pages/page_1329.jpg',
  './assets/assets/cat_a/pages/page_1331.jpg',
  './assets/assets/cat_a/pages/page_1344.jpg',
  './assets/assets/cat_a/pages/page_1345.jpg',
  './assets/assets/cat_a/pages/page_1346.jpg',
  './assets/assets/cat_a/pages/page_1347.jpg',
  './assets/assets/cat_a/pages/page_1348.jpg',
  './assets/assets/cat_a/pages/page_1349.jpg',
  './assets/assets/cat_a/pages/page_1350.jpg',
  './assets/assets/cat_a/pages/page_1351.jpg',
  './assets/assets/cat_a/pages/page_1352.jpg',
  './assets/assets/cat_a/pages/page_1353.jpg',
  './assets/assets/cat_a/pages/page_1354.jpg',
  './assets/assets/cat_a/pages/page_1355.jpg',
  './assets/assets/cat_a/pages/page_1356.jpg',
  './assets/assets/cat_a/pages/page_1357.jpg',
  './assets/assets/cat_a/pages/page_1358.jpg',
  './assets/assets/cat_a/pages/page_1359.jpg',
  './assets/assets/cat_a/pages/page_1360.jpg',
  './assets/assets/cat_a/pages/page_1361.jpg',
  './assets/assets/cat_a/pages/page_1362.jpg',
  './assets/assets/cat_a/pages/page_1363.jpg',
  './assets/assets/cat_a/pages/page_1364.jpg',
  './assets/assets/cat_a/pages/page_1365.jpg',
  './assets/assets/cat_a/pages/page_1366.jpg',
  './assets/assets/cat_a/pages/page_1367.jpg',
  './assets/assets/cat_a/pages/page_887.jpg',
  './assets/assets/cat_a/pages/page_896.jpg',
  './assets/assets/cat_a/pages/page_910.jpg',
  './assets/assets/cat_a/pages/page_911.jpg',
  './assets/assets/cat_a/pages/page_912.jpg',
  './assets/assets/cat_a/pages/page_913.jpg',
  './assets/assets/cat_a/pages/page_915.jpg',
  './assets/assets/cat_a/pages/page_918.jpg',
  './assets/assets/cat_a/pages/page_919.jpg',
  './assets/assets/cat_a/pages/page_920.jpg',
  './assets/assets/cat_a/pages/page_921.jpg',
  './assets/assets/cat_a/pages/page_922.jpg',
  './assets/assets/cat_a/pages/page_923.jpg',
  './assets/assets/cat_a/pages/page_924.jpg',
  './assets/assets/cat_a/pages/page_925.jpg',
  './assets/assets/cat_a/pages/page_926.jpg',
  './assets/assets/cat_a/pages/page_927.jpg',
  './assets/assets/cat_a/pages/page_928.jpg',
  './assets/assets/cat_a/pages/page_929.jpg',
  './assets/assets/cat_a/pages/page_930.jpg',
  './assets/assets/cat_a/pages/page_931.jpg',
  './assets/assets/cat_a/pages/page_932.jpg',
  './assets/assets/cat_a/pages/page_933.jpg',
  './assets/assets/cat_a/pages/page_934.jpg',
  './assets/assets/cat_a/pages/page_935.jpg',
  './assets/assets/cat_a/pages/page_937.jpg',
  './assets/assets/cat_a/pages/page_938.jpg',
  './assets/assets/cat_a/pages/page_939.jpg',
  './assets/assets/cat_a/pages/page_940.jpg',
  './assets/assets/cat_a/pages/page_941.jpg',
  './assets/assets/cat_a/pages/page_942.jpg',
  './assets/assets/cat_a/pages/page_947.jpg',
  './assets/assets/cat_a/pages/page_955.jpg',
  './assets/assets/cat_a/pages/page_961.jpg',
  './assets/assets/cat_a/pages/page_962.jpg',
  './assets/assets/cat_a/pages/page_963.jpg',
  './assets/assets/cat_a/pages/page_964.jpg',
  './assets/assets/cat_a/pages/page_965.jpg',
  './assets/assets/cat_a/pages/page_967.jpg',
  './assets/assets/cat_a/pages/page_969.jpg',
  './assets/assets/cat_a/pages/page_971.jpg',
  './assets/assets/cat_a/pages/page_973.jpg',
  './assets/assets/cat_a/pages/page_982.jpg',
  './assets/assets/cat_a/pages/page_994.jpg',
  './assets/assets/fonts/Roboto-LICENSE.txt',
  './assets/assets/hover_ceiling/HC_4-20_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A.svg',
  './assets/assets/hover_ceiling/HC_4-21_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A.svg',
  './assets/assets/hover_ceiling/HC_4-22_IGE_2.5%20min_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A.svg',
  './assets/assets/hover_ceiling/HC_4-23_IGE_MCP_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A.svg',
  './assets/assets/hover_ceiling/HC_4-24_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A.svg',
  './assets/assets/hover_ceiling/HC_4-25_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A.svg',
  './assets/assets/hover_ceiling/HC_4-26_OGE_2.5%20min_OEI_100_zero%20wind_electrical%20load%20300A.svg',
  './assets/assets/hover_ceiling/HC_4-27_OGE_MCP_OEI_100_zero%20wind_electrical%20load%20300A.svg',
  './assets/assets/hover_ceiling/HC_4-68_OGE_2.5%20min_OEI_102_headwind%20factored_electrical%20load%20300A_clean%20configuration_Heater%20off.svg',
  './assets/assets/hover_ceiling/HC_4-69_OGE_2.5%20min_OEI_102_headwind%20unfactored_electrical%20load%20300A_clean%20configuration_Heater%20off.svg',
  './assets/assets/hover_ceiling/HC_9-126_OGE_2.5%20min_OEI_102_headwind%20unfactored_electrical%20load%20300A_Clean%20Intake.svg',
  './assets/assets/hover_ceiling/HC_9-127_OGE_2.5%20min_OEI_102_headwind%20unfactored_electrical%20load%20300A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_9-131_OGE_TOP_AEO_102_zero%20wind_electrical%20load%20600A_Clean%20Intake.svg',
  './assets/assets/hover_ceiling/HC_9-132_OGE_MCP_AEO_102_zero%20wind_electrical%20load%20600A_Clean%20Intake.svg',
  './assets/assets/hover_ceiling/HC_9-133_OGE_TOP_AEO_102_zero%20wind_electrical%20load%20600A_Clean%20Intake_weight%20up%20to%206800kg.svg',
  './assets/assets/hover_ceiling/HC_9-134_OGE_MCP_AEO_102_zero%20wind_electrical%20load%20600A_Clean%20Intake_weight%20up%20to%206800kg.svg',
  './assets/assets/hover_ceiling/HC_S5-110_OGE_2.5%20min_OEI_102_headwind%20factored_electrical%20load%20300A_EAPS%20OFF_Heater%20off.svg',
  './assets/assets/hover_ceiling/HC_S5-111_OGE_2.5%20min_OEI_102_headwind%20unfactored_electrical%20load%20300A_EAPS%20OFF_Heater%20off.svg',
  './assets/assets/hover_ceiling/HC_S5-27_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-28_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-29_IGE_2.5%20min_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-30_IGE_MCP_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-31_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-32_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-33_OGE_2.5%20min_OEI_100_zero%20wind_electrical%20load%20300A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-34_OGE_MCP_OEI_100_zero%20wind_electrical%20load%20300A_EAPS%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S5-35_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-36_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-37_IGE_2.5%20min_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-38_IGE_MCP_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-39_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-40_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-41_OGE_2.5%20min_OEI_100_zero%20wind_electrical%20load%20300A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-42_OGE_MCP_OEI_100_zero%20wind_electrical%20load%20300A_EAPS%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-43_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20OFF%20or%20ON_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-44_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_EAPS%20OFF%20or%20ON_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-45_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20OFF%20or%20ON_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S5-46_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A_EAPS%20OFF%20or%20ON_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S86-18_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-19_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-20_IGE_2.5%20min_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-21_IGE_MCP_OEI_100_zero%20wind_wheel%20height%205ft_electrical%20load%20300A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-22_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-23_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-24_OGE_2.5%20min_OEI_100_zero%20wind_electrical%20load%20300A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-25_OGE_MCP_OEI_100_zero%20wind_electrical%20load%20300A_IBF.svg',
  './assets/assets/hover_ceiling/HC_S86-26_IGE_TOP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_IBF_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S86-27_IGE_MCP_AEO_100_zero%20wind_wheel%20height%205ft_electrical%20load%20600A_IBF_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S86-28_OGE_TOP_AEO_100_zero%20wind_electrical%20load%20600A_IBF_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S86-29_OGE_MCP_AEO_100_zero%20wind_electrical%20load%20600A_IBF_Heater%20ON.svg',
  './assets/assets/hover_ceiling/HC_S86-30_OGE_2.5%20min_OEI_102_headwind%20factored_electrical%20load%20300A_IBF_Heater%20OFF.svg',
  './assets/assets/hover_ceiling/HC_S86-31_OGE_2.5%20min_OEI_102_headwind%20unfactored_electrical%20load%20300A_IBF_Heater%20OFF.svg',
  './assets/assets/hover_ceiling/data/mcp.json',
  './assets/assets/hover_ceiling/data/mcpoei.json',
  './assets/assets/hover_ceiling/data/mcpoei_eapsOff.json',
  './assets/assets/hover_ceiling/data/mcpoei_eapsOn.json',
  './assets/assets/hover_ceiling/data/mcpoei_ibf.json',
  './assets/assets/hover_ceiling/data/mcp_eapsOff.json',
  './assets/assets/hover_ceiling/data/mcp_eapsOn.json',
  './assets/assets/hover_ceiling/data/mcp_heaterOn.json',
  './assets/assets/hover_ceiling/data/mcp_ibf.json',
  './assets/assets/hover_ceiling/data/mcp_ibf_heaterOn.json',
  './assets/assets/hover_ceiling/data/oei25.json',
  './assets/assets/hover_ceiling/data/oei25_eapsOff.json',
  './assets/assets/hover_ceiling/data/oei25_eapsOn.json',
  './assets/assets/hover_ceiling/data/oei25_ibf.json',
  './assets/assets/hover_ceiling/data/ogemcp.json',
  './assets/assets/hover_ceiling/data/ogemcp102.json',
  './assets/assets/hover_ceiling/data/ogemcp102_hw6800.json',
  './assets/assets/hover_ceiling/data/ogemcpoei.json',
  './assets/assets/hover_ceiling/data/ogemcpoei_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogemcpoei_eapsOn.json',
  './assets/assets/hover_ceiling/data/ogemcpoei_ibf.json',
  './assets/assets/hover_ceiling/data/ogemcp_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogemcp_eapsOn.json',
  './assets/assets/hover_ceiling/data/ogemcp_heaterOn.json',
  './assets/assets/hover_ceiling/data/ogemcp_ibf.json',
  './assets/assets/hover_ceiling/data/ogemcp_ibf_heaterOn.json',
  './assets/assets/hover_ceiling/data/ogeoei25.json',
  './assets/assets/hover_ceiling/data/ogeoei25hw.json',
  './assets/assets/hover_ceiling/data/ogeoei25hwunf.json',
  './assets/assets/hover_ceiling/data/ogeoei25hwunf_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogeoei25hwunf_eapsOff_hc9.json',
  './assets/assets/hover_ceiling/data/ogeoei25hwunf_hc9.json',
  './assets/assets/hover_ceiling/data/ogeoei25hwunf_ibf.json',
  './assets/assets/hover_ceiling/data/ogeoei25hw_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogeoei25hw_ibf.json',
  './assets/assets/hover_ceiling/data/ogeoei25_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogeoei25_eapsOn.json',
  './assets/assets/hover_ceiling/data/ogeoei25_ibf.json',
  './assets/assets/hover_ceiling/data/ogetop.json',
  './assets/assets/hover_ceiling/data/ogetop102.json',
  './assets/assets/hover_ceiling/data/ogetop102_hw6800.json',
  './assets/assets/hover_ceiling/data/ogetop_eapsOff.json',
  './assets/assets/hover_ceiling/data/ogetop_eapsOn.json',
  './assets/assets/hover_ceiling/data/ogetop_heaterOn.json',
  './assets/assets/hover_ceiling/data/ogetop_ibf.json',
  './assets/assets/hover_ceiling/data/ogetop_ibf_heaterOn.json',
  './assets/assets/hover_ceiling/data/top.json',
  './assets/assets/hover_ceiling/data/top_eapsOff.json',
  './assets/assets/hover_ceiling/data/top_eapsOn.json',
  './assets/assets/hover_ceiling/data/top_heaterOn.json',
  './assets/assets/hover_ceiling/data/top_ibf.json',
  './assets/assets/hover_ceiling/data/top_ibf_heaterOn.json',
  './assets/assets/power_assurance/100withEAPS.jpg',
  './assets/assets/power_assurance/100withIBF.jpg',
  './assets/assets/power_assurance/100withoutEAPS.jpg',
  './assets/assets/power_assurance/102withEAPS.jpg',
  './assets/assets/power_assurance/102withIBF.jpg',
  './assets/assets/power_assurance/102withoutEAPS.jpg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // Cache files individually — one failure won't abort the whole install.
      Promise.allSettled(
        PRECACHE.map((url) =>
          // (reload: past the browser's own HTTP cache, which may hold an
          // older copy of the file than the server has)
          cache.add(new Request(url, { cache: 'reload' })).catch((err) =>
            console.warn('[sw] failed to cache:', url, err)
          )
        )
      )
    )
  );
});

self.addEventListener('activate', (event) => {
  // Delete any caches from previous builds.
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((k) => k !== CACHE && OWN_OLD_CACHE.test(k))
            .map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

// The background sweep (about 60 MB of chart images and data) used to start
// the moment the worker activated, i.e. while the app itself was still
// downloading, and the two fought over the connection. Now the page asks for
// it (see index.html) once it has drawn its first screen and gone quiet; a
// separate waitUntil() keeps the worker alive for as long as it takes.
self.addEventListener('message', (event) => {
  if (event.data === 'start-background') {
    event.waitUntil(backgroundPrecache());
  }
});

async function backgroundPrecache() {
  const cache = await caches.open(CACHE);
  for (const url of BACKGROUND) {
    try {
      // Already cached (the user opened it themselves, or a previous sweep
      // got this far already) — skip straight to the next one.
      if (await cache.match(url)) continue;
      await cache.add(url);
    } catch (err) {
      console.warn('[sw] background cache failed:', url, err);
    }
  }
}

// The app shell (the page, the Flutter loader and the app itself) is
// network-first: a new deployment shows up on the very next load, instead of
// the page of the new version running the cached app of the old one (the
// service worker used to serve main.dart.js from its cache until the update
// had installed and the page was reloaded). The cache is the fallback when
// offline or when the network takes more than a few seconds, so the app
// still opens at once without a connection.
const SHELL_FILES = [
  'main.dart.js',
  'flutter.js',
  'flutter_bootstrap.js',
  'planner_worker.js',
  'version.json',
  'index.html',
  'manifest.json',
];

function isShell(req, url) {
  if (req.mode === 'navigate') return true;
  const path = url.pathname;
  return path.endsWith('/') || SHELL_FILES.some((f) => path.endsWith('/' + f));
}

async function networkFirst(req) {
  const cache = await caches.open(CACHE);
  try {
    const response = await Promise.race([
      // (no-cache: ask the server whether the file changed, a cheap 304
      // when it did not, instead of trusting the browser's HTTP cache)
      fetch(req.url, { cache: 'no-cache' }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), 4000)
      ),
    ]);
    if (response.ok) cache.put(req, response.clone());
    return response;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    // The page itself may fall back to the cached index.html, but a script
    // must never: answering a request for flutter_bootstrap.js or
    // main.dart.js with HTML makes the browser fail to parse it, Flutter
    // never starts and the loading skeleton stays on screen for good. For
    // those the network gets the time it needs (no timeout) instead.
    if (req.mode === 'navigate') {
      const page = await cache.match('./index.html');
      if (page) return page;
    } else {
      try {
        return await fetch(req.url);
      } catch (_) {
        // offline and not cached: a real network error, which the loader
        // can report, rather than a wrong file
      }
    }
    return Response.error();
  }
}

// Other sites whose files never change under the same URL, and which the
// app needs offline: the fonts the Flutter web engine fetches (Roboto and
// the fallback fonts for symbols).
const STATIC_HOSTS = ['fonts.gstatic.com'];

// Cache-first is for files that cannot change under their URL within one
// build: the app's own files (CanvasKit, the chart images and data) and the
// static hosts above. Everything else, i.e. live data from another site (the
// weather service of the fuel calculator, analytics), is left to the
// browser and the network: caching it here would keep answering with the
// first reply (yesterday's temperature) until the next deployment.
function isCacheFirst(url) {
  return url.origin === self.location.origin ||
    STATIC_HOSTS.includes(url.hostname);
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin && isShell(req, url)) {
    event.respondWith(networkFirst(req));
    return;
  }
  if (!isCacheFirst(url)) return;
  event.respondWith(
    caches.match(req).then((cached) =>
      cached ||
      fetch(req).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return response;
      })
    )
  );
});
