import imagePath from "../../constants/imagePath";
import strings from "../../constants/lang";

const colorArray = [
  '#FF7E79',
  '#D4FB79',
  '#76D6FF',
  '#FF8AD8',
  '#942192',
  '#FFFF99',
  '#5E9AFC',
  '#FF5353',
  '#FDA223',
  '#00C699',
];

const transportationArray=[
  {id: 1, activeIcon: imagePath.walkBlue, inactiveIcon: imagePath.walk},
  {
    id: 2,
    activeIcon: imagePath.cycleActive,
    inactiveIcon: imagePath.cycleInactive,
  },
  {
    id: 3,
    activeIcon: imagePath.bikeSelected,
    inactiveIcon: imagePath.bikeNonSelected,
  },
  {
    id: 4,
    activeIcon: imagePath.carSelectd,
    inactiveIcon: imagePath.carNonSelectd,
  },
  {
    id: 5,
    activeIcon: imagePath.truckActive,
    inactiveIcon: imagePath.truckInactive,
  },
  
]
const employeetypeArray = [
  {id: 1, activeIcon: imagePath.redioSelectedButton, inactiveIcon: imagePath.redioUnSelectedButton,typeName:strings.EMPLOYEE},
  {
    id: 2,
    activeIcon: imagePath.redioSelectedButton,
    inactiveIcon: imagePath.redioUnSelectedButton,
    typeName:strings.FREELANCER
  },
]

export {colorArray,transportationArray,employeetypeArray};
