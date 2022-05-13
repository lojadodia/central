import { UserAddress } from "@ts-types/generated";

function removeEmpty(obj: any): any {
  return Object.entries(obj)
    .filter(([_, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({ ...acc, [k]: v === Object(v) ? removeEmpty(v) : v }),
      {}
    );
}

export function formatAddress(address: UserAddress) {
  let formattedAddress = {};
  if (address) {
    formattedAddress = removeEmpty(address);
  }
  return formattedAddress?.street_address + ' ' + formattedAddress?.door + ' ' + formattedAddress?.details + ', '+ formattedAddress?.zip + ', ' + formattedAddress?.city + ', ' + formattedAddress?.state;
}
