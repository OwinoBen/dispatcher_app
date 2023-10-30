import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ContentLoader, {Rect, Circle} from 'react-content-loader/native';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';

const CircularProfileLoader = ({
  backgroundColor = colors.greyNew,
  foregroundColor = '#DFDFDF',
  isDesc = true,
  size = 30,
}) => {
  return (
    <ContentLoader
      foregroundColor={foregroundColor}
      backgroundColor={backgroundColor}
      width={moderateScale(60)}
      height={moderateScaleVertical(70)}>
      <Circle
        cx={moderateScale(size)}
        cy={moderateScale(size)}
        r={moderateScale(size)}
      />

      {isDesc && (
        <>
          <Rect x="80" y="12" rx="8" ry="8" width="60" height="16" />
          <Rect x="80" y="40" rx="8" ry="8" width="70" height="9" />
          <Rect x="80" y="55" rx="8" ry="8" width="70" height="9" />
        </>
      )}
    </ContentLoader>
  );
};

const styles = StyleSheet.create({});
export default React.memo(CircularProfileLoader);
