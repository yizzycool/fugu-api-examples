const joyConUtils = {
  filters: [
    // Filter on devices with the Nintendo Switch Joy-Con USB Vendor/Product IDs.
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2006 // Joy-Con Left
    },
    {
      vendorId: 0x057e, // Nintendo Co., Ltd
      productId: 0x2007 // Joy-Con Right
    }
  ],
  enableVibrationData: [1, 0, 1, 64, 64, 0, 1, 64, 64, 0x48, 0x01],  // Magical bytes come from https://github.com/mzyy94/joycon-toolweb
  rightButtonsMap: { 1: "A", 2: "X", 4: "B", 8: "Y" },
  getRumbleData: (deviceCounter = 0) => {
    const hf = 0x0098;
    const lf = 0x46;
    const hfa = 0x1e;
    const lfa = 0x8047;
    const lhf = hf;
    const llf = lf;
    const lhfa = hfa;
    const llfa = lfa;
    const rhf = hf;
    const rlf = lf;
    const rhfa = hfa;
    const rlfa = lfa;
    const rumbleData = [
      deviceCounter++ & 0xff,
      lhf & 0xff,
      lhfa + ((lhf >>> 8) & 0xff),
      llf + ((llfa >>> 8) & 0xff),
      llfa & 0xff,
      rhf & 0xff,
      rhfa + ((rhf >>> 8) & 0xff),
      rlf + ((rlfa >>> 8) & 0xff),
      rlfa & 0xff
    ];
    return rumbleData;
  }
}

export default joyConUtils;