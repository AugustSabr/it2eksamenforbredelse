function separateFloat(floatNum) {
  const floatStr = floatNum.toString();
  const parts = floatStr.split('.');
  const leftPart = parseInt(parts[0], 10);
  let rightPart = parts.length > 1 ? parts[1] : '0';
  console.log(rightPart);
  rightPart = rightPart.padEnd(2, '0').substring(0, 2); // Ensure rightPart has two digits

  return {
    left: leftPart,
    right: rightPart
  };
}
console.log(separateFloat(11.04)); // Output: { left: 1, right: "04" }
console.log(separateFloat(14.4));  // Output: { left: 1, right: "40" }
console.log(separateFloat(51.)); // Output: { left: 1, right: "40" }
