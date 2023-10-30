import validator from 'is_js';
import strings from '../constants/lang';
const checkEmpty = (val, key) => {
  if (validator.empty(val)) {
    return `${strings.PLEASE_ENTER} ${key}`;
  } else {
    return '';
  }
};

const checkSelection = (val, key) => {
  if (validator.empty(val)) {
    return `${strings.PLEASE_SELECT} ${key}`;
  } else {
    return '';
  }
};

const checkMinLength = (val, minLength, key) => {
  if (val.trim().length < minLength) {
    return `${strings.PLEASE_ENTER} ${strings.VALID} ${key}`;
  } else {
    return '';
  }
};

const checkMinValue = (val, key) => {
  if (val == 0) {
    return `${strings.PLEASE_ENTER} ${key}`;
  } else {
    return '';
  }
};

export default function (data) {
  let error = '';
  const {
    username,
    email,
    name,
    password,
    phoneNumber,
    newPassword,
    confirmPassword,
    message,
    otp,
    address,
    street,
    city,
    pincode,
    states,
    country,
    modelMake,
    vehicleColor,
    vehiclePlateNumber,
    payoutAmount,
    selectedPayoutOption,
    beneficiaryName,
    beneficiaryAcNum,
    beneficiaryISFC,
    beneficiaryBankName,
    accountNumber,
    confirmAccountNumber,
  } = data;

  if (username !== undefined) {
    let emptyValidationText = checkEmpty(username, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(username, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (name !== undefined) {
    let emptyValidationText = checkEmpty(name, strings.NAME);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 3, strings.NAME);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (address !== undefined) {
    let emptyValidationText = checkEmpty(address, strings.ENTER_NEW_ADDRESS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (modelMake !== undefined) {
    let emptyValidationText = checkEmpty(
      modelMake,
      strings.PLEASEENTERMODELTYPE,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (vehicleColor !== undefined) {
    let emptyValidationText = checkEmpty(
      vehicleColor,
      strings.PLEASEENTERCOLOR,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (vehiclePlateNumber !== undefined) {
    let emptyValidationText = checkEmpty(
      vehiclePlateNumber,
      strings.PLEASEENTERPLATENUMBER,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (street !== undefined) {
    let emptyValidationText = checkEmpty(street, strings.ENTER_STREET);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (city !== undefined) {
    let emptyValidationText = checkEmpty(city, strings.CITY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (states !== undefined) {
    let emptyValidationText = checkEmpty(states, strings.STATE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (country !== undefined) {
    let emptyValidationText = checkEmpty(country, strings.COUNTRY);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }
  if (pincode !== undefined) {
    let emptyValidationText = checkEmpty(pincode, strings.PINCODE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if (lastName !== undefined) {
  // 	let emptyValidationText = checkEmpty(lastName, 'last name');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		let minLengthValidation = checkMinLength(lastName, 3, 'Last name');
  // 		if (minLengthValidation !== '') {
  // 			return minLengthValidation;
  // 		}
  // 	}
  // // }

  // if (date !== undefined) {
  // 	let emptyValidationText = checkEmpty(date, 'date');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	} else {
  // 		if (validator.date(date)) {
  // 			ToastAndroid.showWithGravityAndOffset(`please Valid ${date}`,
  //   ToastAndroid.LONG,
  //   ToastAndroid.TOP,
  //   0,
  //   100
  //   )
  // 			return 'Please enter valid email';
  // 		}
  // 	}
  // }

  if (email !== undefined) {
    let emptyValidationText = checkEmpty(email, strings.EMAIL);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      if (!validator.email(email)) {
        return `${strings.PLEASE_ENTER} ${strings.VALID} ${strings.EMAIL}`;
      }
    }
  }

  if (phoneNumber !== undefined) {
    let emptyValidationText = checkEmpty(
      phoneNumber,
      strings.PHONENUMBER.toLocaleLowerCase(),
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (!/^[0][0-9]$|^[0-9]\d{4,14}$/.test(phoneNumber)) {
      return `${strings.PLEASE_ENTER} ${
        strings.VALID
      } ${strings.PHONENUMBER.toLocaleLowerCase()}`;
    }
  }

  if (otp !== undefined) {
    let emptyValidationText = checkEmpty(otp, strings.OTP);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  // if(emailMobile!==undefined){
  // 	let emptyValidationText = checkEmpty(emailMobile, 'Email or mobile');
  // 	if (emptyValidationText !== '') {
  // 		return emptyValidationText;
  // 	}
  // 	if (!/^[0][1-9]$|^[1-9]\d{8,14}$/.test(emailMobile)) {
  // 		if (!validator.email(emailMobile)) {
  // 			return 'Please enter valid email or mobile';
  // 		}
  // 	}
  // }

  if (password !== undefined) {
    let emptyValidationText = checkEmpty(password, strings.PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(password, 6, strings.PASSWORD);
      if (minLengthValidation !== '') {
        if (password != undefined) {
          return `${strings.PASSWORD_CAP} ${strings.REQUIRE_SIX_CHAR}`;
        }
        return `${strings.PASSWORD_CAP} ${strings.IS_INCORRECT}`;
      }
    }
  }

  if (newPassword !== undefined) {
    let emptyValidationText = checkEmpty(newPassword, strings.NEW_PASSWORD);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(
        newPassword,
        6,
        strings.NEW_PASSWORD,
      );
      if (minLengthValidation !== '') {
        if (newPassword != undefined) {
          return `${strings.NEW_PASSWORD} ${strings.REQUIRE_SIX_CHAR}`;
        }
        return `${strings.NEW_PASSWORD} ${strings.IS_INCORRECT}`;
      }
    }
  }

  if (confirmPassword !== undefined) {
    let emptyValidationText = checkEmpty(confirmPassword, strigns.CONFIRM_PASS);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (confirmPassword != newPassword) {
      return strings.PASS_NOT_MATCHED;
    }
  }

  if (message !== undefined) {
    let emptyValidationText = checkEmpty(message, strings.MESSAGE);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minLengthValidation = checkMinLength(name, 6, strings.MESSAGE);
      if (minLengthValidation !== '') {
        return minLengthValidation;
      }
    }
  }

  if (payoutAmount !== undefined) {
    let emptyValidationText = checkEmpty(payoutAmount, strings.PAYOUT_AMOUNT);
    if (emptyValidationText !== '') {
      return emptyValidationText;
    } else {
      let minValueValidation = checkMinValue(
        payoutAmount,
        `${strings.VALID} ${strings.PAYOUT_AMOUNT}`,
      );
      if (minValueValidation !== '') {
        return minValueValidation;
      }
    }
  }

  if (selectedPayoutOption !== undefined) {
    let emptyValidationText = checkSelection(
      selectedPayoutOption,
      strings.A_PAYOUT_OPTION,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (beneficiaryName !== undefined) {
    let emptyValidationText = checkEmpty(
      beneficiaryName,
      strings.BENEFICIARY_NAME.toLocaleLowerCase(),
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (beneficiaryAcNum !== undefined) {
    let emptyValidationText = checkEmpty(
      beneficiaryAcNum,
      strings.BENEFICIARY_AC_NUMBER.toLocaleLowerCase(),
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (beneficiaryISFC !== undefined) {
    let emptyValidationText = checkEmpty(
      beneficiaryISFC,
      strings.BENEFICIARY_IFSC,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (beneficiaryBankName !== undefined) {
    let emptyValidationText = checkEmpty(
      beneficiaryBankName,
      strings.BENEFICIARY_BANK_NAME.toLocaleLowerCase(),
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
  }

  if (accountNumber !== undefined) {
    let emptyValidationText = checkEmpty(
      accountNumber,
      strings.ACCOUNTNUMBER.toLocaleLowerCase(),
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (!/^[0][0-9]$|^[0-9]\d{4,20}$/.test(accountNumber)) {
      return `${strings.PLEASE_ENTER} ${
        strings.VALID
      } ${strings.ACCOUNTNUMBER.toLocaleLowerCase()}`;
    }
  }
  if (confirmAccountNumber !== undefined) {
    let emptyValidationText = checkEmpty(
      confirmAccountNumber,
      strings?.CONFIRMACCOUNTNUMBER,
    );
    if (emptyValidationText !== '') {
      return emptyValidationText;
    }
    if (confirmAccountNumber != accountNumber) {
      return strings.ACCOUNTVALIDATION;
    }
  }
}
