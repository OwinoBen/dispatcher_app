import React from "react";
import SwitchSelector from "react-native-switch-selector";
import colors from "../styles/colors";
import { StyleSheet } from "react-native";
import fontFamily from "../styles/fontFamily";
import {
  height,
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from "../styles/responsiveSize";
import { TouchableOpacity, View, Text, Image } from "react-native";
import imagePath from "../constants/imagePath";
import moment from "moment";
import generateBoxShadowStyle from "./generateBoxShadowStyle";
import { getColorCodeWithOpactiyNumber } from "../utils/helperFunctions";
import { colorArray } from "../utils/constants/ConstantValues";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import strings from "../constants/lang";
import GradientButton from "./GradientButton";
const PoolingSuggestionCard = ({
  data = {},
  allTasks = [],
  index = null,
  _onPressTask = () => { },
  showCurrency = false,
  previousData = null,
  isFromHistory = false,
  mainOrderSuggestionData = {},
}) => {
  //Get Date
  const defaultLanguagae = useSelector(
    (state) => state?.initBoot?.defaultLanguage
  );
  const styles = stylesFunc({ defaultLanguagae });

  const getDate = (date) => {
    const local = moment.utc(date).local().format("DD MMM YYYY hh:mm:a");
    return local;
  };

  //get BackGroundColor
  const getBackGroudColor = (name) => {
    switch (name) {
      case "Pickup":
        return getColorCodeWithOpactiyNumber(colors.circularBlue.substr(1), 50);
        break;
      case "Drop":
        return getColorCodeWithOpactiyNumber(
          colors.circularOrnage.substr(1),
          50
        );
        break;
      default:
        return getColorCodeWithOpactiyNumber(colors.circularRed.substr(1), 50);
        break;
    }
  };

  /****GET DYNAMIC VALUES */
  const getDynamicUpdateOnValues = () => {
    var colorData = colorArray;

    if (data?.order_id == previousData?.order_id) {
      data["backgroundColor"] = previousData?.backgroundColor;
      data["blur"] = 0.5;
      data["click"] = true;
      allTasks[allTasks.indexOf(data)] = data;
      data["marginTop"] = moderateScale(0);
      return {
        backgroundColor: data?.backgroundColor,
        blur: data?.blur,
        click: data?.click,

        marginTop: data?.marginTop,
      };
    } else {
      data["backgroundColor"] =
        colorData[allTasks.indexOf(data) % colorData.length];
      data["blur"] = 1;
      data["click"] = false;
      allTasks[allTasks.indexOf(data)] = data;
      data["marginTop"] = moderateScale(20);

      return {
        backgroundColor: data?.backgroundColor,
        blur: data?.blur,
        click: data?.click,
        marginTop: data?.marginTop,
      };
      // return colorData[allTasks.indexOf(data) % colorData.length];
    }
  };

  const renderDotContainer = (i) => {
    return (
      <View style={{ justifyContent: "center", stifyContent: "center" }}>
        <Image
          style={{
            height: moderateScale(8),
            width: moderateScale(8),
          }}
          source={imagePath.ic_pickupAddress}
        />

        <View
          style={{
            marginHorizontal: moderateScale(3.5),
            width: 0.5,
            height: moderateScaleVertical(45),
            backgroundColor: colors.black,
          }}
        />
        <Image
          style={{
            height: moderateScale(8),
            width: moderateScale(8),
          }}
          source={imagePath.ic_dropupAddress}
        />
      </View>
    );
  };


  return (
    <View
      activeOpacity={1}
      disabled={getDynamicUpdateOnValues().click}
    // onPress={_onPressTask}
    >
      <View
        opacity={getDynamicUpdateOnValues().blur}
        style={{
          ...styles.shadowStyle,
        }}
      >
        <View style={styles.mainContainer}>
          <View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={{ fontFamily: fontFamily?.bold }}>
                  Pick Location :{" "}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ fontFamily: fontFamily?.semiBold }}>
                    {(mainOrderSuggestionData?.distance_pickup).toFixed(3)} km
                  </Text>
                  <Text style={{ fontFamily: fontFamily?.semiBold }}>
                    {" "}
                    Away
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: fontFamily?.bold }}>
                  Booked Seats :
                </Text>
                <Text style={{ marginHorizontal: moderateScale(5), fontFamily: fontFamily?.semiBold }}>
                  {mainOrderSuggestionData?.no_seats_for_pooling}
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: moderateScale(10),
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {mainOrderSuggestionData?.task?.length > 0 &&
              <View
                style={{
                  flex: 0.05,
                  alignItems: "center",
                }}
              >
                {renderDotContainer(1)}
              </View>
            }

            <View style={{ flex: 0.9, marginLeft: moderateScale(5) }}>
              {mainOrderSuggestionData?.task?.map((item, index) => {
                return (
                  <Text
                    numberOfLines={1}
                    style={{
                      marginVertical: moderateScaleVertical(15),
                      fontSize: textScale(13),
                      fontFamily: fontFamily?.regular,
                    }}
                  >
                    {item?.location?.address}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export function stylesFunc({ defaultLanguagae }) {
  const styles = StyleSheet.create({
    textStyle: {
      fontFamily: fontFamily.semiBold,
    },
    textInputStyle: { width: width / 1.8 },
    address: {
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(14),
    },
    shadowStyle: {
      flexDirection: defaultLanguagae?.value === "ar" ? "row-reverse" : "row",
      borderWidth: 1,
      marginHorizontal: moderateScale(10),
      borderColor: colors.grey2,

      backgroundColor: colors.white,
    },
    borderLine: {
      width: moderateScale(5),
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
    },
    dateTimeStyle: {
      fontFamily: fontFamily.semiBold,
      fontSize: textScale(10),
      opacity: 0.5,
      paddingLeft: 5,
    },
    statusView: {
      minWidth: moderateScale(60),
      maxWidth: moderateScale(100),
      padding: moderateScale(3),
      marginTop: moderateScale(10),
      borderRadius: moderateScale(10),
      justifyContent: "center",
    },
    mainContainer: {
      width: "100%",
      marginVertical: moderateScale(10),
      paddingHorizontal: moderateScale(10),
    },
    dateContainer: {
      flexDirection: defaultLanguagae?.value === "ar" ? "row-reverse" : "row",
      marginTop: moderateScale(10),
    },
    currencyContainer: {
      flexDirection: defaultLanguagae?.value === "ar" ? "row-reverse" : "row",
      marginTop: moderateScale(5),
    },
    dotViewStyle: {
      flex: 0.4,
      alignItems: defaultLanguagae?.value === "ar" ? "flex-start" : "flex-end",
      // justifyContent: 'center',
      margin: moderateScale(10),
    },
    dotBaseViewStyle: {
      backgroundColor: colors.redB,
      height: moderateScale(10),
      width: moderateScale(10),
      borderRadius: moderateScale(10 / 2),
      marginTop: moderateScaleVertical(10),
    },
    taskTypeName: {
      textAlign: "center",
      fontFamily: fontFamily.bold,
      fontSize: textScale(10),
    },
  });
  return styles;
}

export default PoolingSuggestionCard;
