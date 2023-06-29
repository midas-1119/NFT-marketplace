var keccak256 = require("@ethersproject/keccak256");
var bytes = require("@ethersproject/bytes");

export const normalizeAccount = (_address: string) => {
  !(typeof _address === "string" && _address.match(/^(0x)?[0-9a-fA-F]{40}$/))
    ? //@ts-ignore
      invariant(false, "Invalid address " + _address)
    : void 0;
  var address = _address.substring(0, 2) === "0x" ? _address : "0x" + _address;
  var chars = address.toLowerCase().substring(2).split("");
  var charsArray = new Uint8Array(40);

  for (var i = 0; i < 40; i++) {
    charsArray[i] = chars[i].charCodeAt(0);
  }

  var hashed = bytes.arrayify(keccak256.keccak256(charsArray));

  for (var _i = 0; _i < 40; _i += 2) {
    if (hashed[_i >> 1] >> 4 >= 8) {
      chars[_i] = chars[_i].toUpperCase();
    }

    if ((hashed[_i >> 1] & 0x0f) >= 8) {
      chars[_i + 1] = chars[_i + 1].toUpperCase();
    }
  }

  var addressChecksum = "0x" + chars.join("");
  !!(
    address.match(/([A-F].*[a-f])|([a-f].*[A-F])/) &&
    address !== addressChecksum
  )
    ? //@ts-ignore
      invariant(
        false,
        "Bad address checksum " + address + " " + addressChecksum
      )
    : void 0;
  return addressChecksum;
};
