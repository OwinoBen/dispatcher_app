import { getBundleId } from "react-native-device-info";
import { appIds, shortCodes } from "../../utils/constants/DynamicAppKeys";

export const getAppCode = () => {
switch (getBundleId()) {
case appIds.patazone: return shortCodes.patazon
default: return '1da2e9'
}
}