export const someLongES6Synthax = ({ arr }) => {
  return arr
    .map((element, index) => {
      return { ...element, sn: index };
    })
    .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))[
    arr.length - 1
  ];
};
